%% Copyright (C) 2020-2026 Fluxer Contributors
%% Copyright (C) 2026 Floodilka Contributors
%%
%% This file is part of Floodilka, a fork of Fluxer
%% (https://github.com/fluxerapp/fluxer).
%% Modified by Floodilka Contributors starting March 2026.
%%
%% Floodilka is free software: you can redistribute it and/or modify
%% it under the terms of the GNU Affero General Public License as published by
%% the Free Software Foundation, either version 3 of the License, or
%% (at your option) any later version.
%%
%% Floodilka is distributed in the hope that it will be useful,
%% but WITHOUT ANY WARRANTY; without even the implied warranty of
%% MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
%% GNU Affero General Public License for more details.
%%
%% You should have received a copy of the GNU Affero General Public License
%% along with Floodilka. If not, see <https://www.gnu.org/licenses/>.

%% @doc Cluster-replicated key-value store with LWW-Map CRDT semantics.
%%
%% One replicator per "topic" (e.g. presence, voice_rooms, guild_member_list).
%% Each topic has:
%%   - a local ETS table (named_table, public, set, read_concurrency)
%%   - a pg group for change broadcast and peer discovery
%%   - a gen_server owning writes + anti-entropy gossip
%%
%% Reads are direct ETS lookups (~100ns) — bypass the gen_server.
%% Writes go through the gen_server: insert local + broadcast {update, ...}.
%% Tombstones (deletes) are kept in the ETS until garbage collected.
%%
%% Conflict resolution: LWW by {Timestamp, Node}.
%% Anti-entropy: every SYNC_INTERVAL_MS, each node sends a snapshot request to
%% a random peer; the peer replies with its full ETS, the requester merges.
%% On nodeup (cluster grew), we trigger an immediate anti-entropy round.

-module(cluster_state_replicator).
-behaviour(gen_server).

-export([
    start_link/1,
    put/3,
    delete/2,
    get/2,
    get_all/1,
    bulk_get/2,
    size/1
]).

-export([init/1, handle_call/3, handle_cast/2, handle_info/2, terminate/2, code_change/3]).

-define(SCOPE, cluster_state_replicator_scope).
-define(SYNC_INTERVAL_MS, 10000).
-define(SYNC_JITTER_MS, 3000).

-type topic() :: atom().
-type key() :: term().
-type value() :: term().
-type ts() :: integer().
-type entry() :: {value(), ts(), node()} | {tombstone, ts(), node()}.

-record(state, {
    topic :: topic(),
    table :: atom(),
    group :: term(),
    last_clock = 0 :: ts()
}).

%% ─── Public API ────────────────────────────────────────────────────────────

-spec start_link(topic()) -> {ok, pid()} | {error, term()}.
start_link(Topic) when is_atom(Topic) ->
    gen_server:start_link({local, server_name(Topic)}, ?MODULE, Topic, []).

-spec put(topic(), key(), value()) -> ok.
put(Topic, Key, Value) ->
    gen_server:call(server_name(Topic), {put, Key, Value}).

-spec delete(topic(), key()) -> ok.
delete(Topic, Key) ->
    gen_server:call(server_name(Topic), {delete, Key}).

-spec get(topic(), key()) -> value() | undefined.
get(Topic, Key) ->
    case ets:lookup(table_name(Topic), Key) of
        [{Key, {tombstone, _Ts, _Node}}] -> undefined;
        [{Key, {Value, _Ts, _Node}}] -> Value;
        [] -> undefined
    end.

-spec get_all(topic()) -> [{key(), value()}].
get_all(Topic) ->
    Table = table_name(Topic),
    ets:foldl(
        fun
            ({_K, {tombstone, _, _}}, Acc) -> Acc;
            ({K, {V, _Ts, _Node}}, Acc) -> [{K, V} | Acc]
        end,
        [],
        Table
    ).

-spec bulk_get(topic(), [key()]) -> #{key() => value()}.
bulk_get(Topic, Keys) ->
    Table = table_name(Topic),
    lists:foldl(
        fun(K, Acc) ->
            case ets:lookup(Table, K) of
                [{K, {tombstone, _, _}}] -> Acc;
                [{K, {V, _Ts, _Node}}] -> Acc#{K => V};
                [] -> Acc
            end
        end,
        #{},
        Keys
    ).

-spec size(topic()) -> non_neg_integer().
size(Topic) ->
    %% Includes tombstones — caller probably wants live count via get_all length.
    ets:info(table_name(Topic), size).

%% ─── gen_server callbacks ──────────────────────────────────────────────────

-spec init(topic()) -> {ok, #state{}}.
init(Topic) when is_atom(Topic) ->
    process_flag(trap_exit, true),
    Table = table_name(Topic),
    case ets:info(Table) of
        undefined ->
            ets:new(Table, [named_table, public, set, {read_concurrency, true}]);
        _ -> ok
    end,
    ensure_pg_scope(),
    Group = group_name(Topic),
    ok = pg:join(?SCOPE, Group, self()),
    %% React to cluster membership changes for immediate anti-entropy.
    ok = net_kernel:monitor_nodes(true, [{node_type, all}]),
    schedule_sync(),
    logger:notice("[cluster_state_replicator] topic=~p table=~p group=~p started, peers=~p",
                  [Topic, Table, Group, peers(Group)]),
    {ok, #state{topic = Topic, table = Table, group = Group}}.

-spec handle_call(term(), gen_server:from(), #state{}) -> {reply, term(), #state{}}.
handle_call({put, Key, Value}, _From, State) ->
    {Ts, NewState} = next_clock(State),
    Entry = {Value, Ts, node()},
    ets:insert(State#state.table, {Key, Entry}),
    broadcast(State#state.group, {update, Key, Entry}),
    {reply, ok, NewState};
handle_call({delete, Key}, _From, State) ->
    {Ts, NewState} = next_clock(State),
    Entry = {tombstone, Ts, node()},
    ets:insert(State#state.table, {Key, Entry}),
    broadcast(State#state.group, {update, Key, Entry}),
    {reply, ok, NewState};
handle_call(_Msg, _From, State) ->
    {reply, {error, unknown_call}, State}.

-spec handle_cast(term(), #state{}) -> {noreply, #state{}}.
handle_cast(_Msg, State) ->
    {noreply, State}.

-spec handle_info(term(), #state{}) -> {noreply, #state{}}.
handle_info({update, Key, RemoteEntry}, State) ->
    apply_remote_entry(State#state.table, Key, RemoteEntry),
    {noreply, State};
handle_info({sync_request, FromPid, _Topic}, State) ->
    Snapshot = ets:tab2list(State#state.table),
    erlang:send(FromPid, {sync_response, Snapshot}),
    {noreply, State};
handle_info({sync_response, Snapshot}, State) ->
    lists:foreach(
        fun({K, RemoteEntry}) -> apply_remote_entry(State#state.table, K, RemoteEntry) end,
        Snapshot
    ),
    {noreply, State};
handle_info(anti_entropy, State) ->
    case pick_random_peer(State#state.group) of
        none -> ok;
        Peer ->
            erlang:send(Peer, {sync_request, self(), State#state.topic})
    end,
    schedule_sync(),
    {noreply, State};
handle_info({nodeup, _Node, _Info}, State) ->
    %% New cluster member — kick anti-entropy immediately so we exchange state.
    self() ! anti_entropy,
    {noreply, State};
handle_info({nodedown, _Node, _Info}, State) ->
    %% Members will leave the pg group on their own; no action needed here.
    {noreply, State};
handle_info(_Msg, State) ->
    {noreply, State}.

-spec terminate(term(), #state{}) -> ok.
terminate(_Reason, _State) ->
    ok.

-spec code_change(term(), #state{}, term()) -> {ok, #state{}}.
code_change(_OldVsn, State, _Extra) ->
    {ok, State}.

%% ─── Internal ──────────────────────────────────────────────────────────────

-spec server_name(topic()) -> atom().
server_name(Topic) ->
    list_to_atom("cluster_state_repl_" ++ atom_to_list(Topic)).

-spec table_name(topic()) -> atom().
table_name(Topic) ->
    list_to_atom("cluster_state_tab_" ++ atom_to_list(Topic)).

-spec group_name(topic()) -> {cluster_state, topic()}.
group_name(Topic) ->
    {cluster_state, Topic}.

-spec ensure_pg_scope() -> ok.
ensure_pg_scope() ->
    case pg:start_link(?SCOPE) of
        {ok, _Pid} -> ok;
        {error, {already_started, _Pid}} -> ok
    end.

-spec next_clock(#state{}) -> {ts(), #state{}}.
next_clock(#state{last_clock = Last} = State) ->
    Now = erlang:system_time(microsecond),
    Ts = max(Now, Last + 1),
    {Ts, State#state{last_clock = Ts}}.

-spec broadcast(term(), term()) -> ok.
broadcast(Group, Msg) ->
    Members = peers(Group),
    lists:foreach(fun(Pid) -> erlang:send(Pid, Msg, [noconnect]) end, Members),
    ok.

-spec peers(term()) -> [pid()].
peers(Group) ->
    case catch pg:get_members(?SCOPE, Group) of
        Members when is_list(Members) -> [P || P <- Members, P =/= self()];
        _ -> []
    end.

-spec pick_random_peer(term()) -> pid() | none.
pick_random_peer(Group) ->
    case peers(Group) of
        [] -> none;
        Members ->
            Idx = rand:uniform(length(Members)),
            lists:nth(Idx, Members)
    end.

-spec schedule_sync() -> reference().
schedule_sync() ->
    Jitter = rand:uniform(?SYNC_JITTER_MS),
    erlang:send_after(?SYNC_INTERVAL_MS + Jitter, self(), anti_entropy).

-spec apply_remote_entry(atom(), key(), entry()) -> ok.
apply_remote_entry(Table, Key, RemoteEntry) ->
    case ets:lookup(Table, Key) of
        [] ->
            ets:insert(Table, {Key, RemoteEntry});
        [{Key, LocalEntry}] ->
            case is_remote_newer(RemoteEntry, LocalEntry) of
                true -> ets:insert(Table, {Key, RemoteEntry});
                false -> ok
            end
    end,
    ok.

-spec is_remote_newer(entry(), entry()) -> boolean().
is_remote_newer({_, RTs, _RNode}, {_, LTs, _LNode}) when RTs > LTs -> true;
is_remote_newer({_, RTs, RNode}, {_, LTs, LNode}) when RTs =:= LTs, RNode > LNode -> true;
is_remote_newer(_, _) -> false.
