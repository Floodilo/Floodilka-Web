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

%% @doc Cluster-aware consistent hash ring for assigning entity ownership
%% (guilds, calls, etc.) to gateway nodes.
%%
%% Same pattern Discord describes in "Scaling Elixir to 5M users": a guild
%% lives on exactly one node — the node selected by hashing guild_id through
%% a shared ring. Sessions on any other node route messages to that owner via
%% Erlang distribution (see guild_router for the routing layer).
%%
%% Storage: ETS ordered_set keyed by virtual-node hash, value is the owner
%% node. Lookup uses ets:next/2 — O(log N) where N is the number of
%% virtual nodes (REPLICAS × cluster_size, ~256×16 = ~4k entries at our
%% target scale). Direct ETS reads from any process; no gen_server call on
%% the read path.
%%
%% Membership: gen_server subscribes to net_kernel:monitor_nodes/2. On
%% nodeup/nodedown the ring is rebuilt. Consistent hashing means only ~1/N
%% of keys change ownership when a node is added or removed.

-module(hash_ring).
-behaviour(gen_server).

-export([start_link/0, owner_node/1, is_local/1, all_nodes/0, status/0]).
-export([init/1, handle_call/3, handle_cast/2, handle_info/2, terminate/2, code_change/3]).

-define(TABLE, hash_ring_table).
-define(REPLICAS, 256).
-define(HASH_RANGE, 1073741824).  %% 2^30

-record(state, {
    members = [] :: [node()]
}).

%% ─── Public API ────────────────────────────────────────────────────────────

-spec start_link() -> {ok, pid()} | {error, term()}.
start_link() ->
    gen_server:start_link({local, ?MODULE}, ?MODULE, [], []).

%% @doc Owner of this key. Read-only path, no gen_server call.
-spec owner_node(term()) -> node().
owner_node(Key) ->
    case ets:info(?TABLE) of
        undefined ->
            node();
        _ ->
            KeyHash = phash(Key),
            owner_for_hash(KeyHash)
    end.

-spec is_local(term()) -> boolean().
is_local(Key) ->
    owner_node(Key) =:= node().

-spec all_nodes() -> [node()].
all_nodes() ->
    case ets:info(?TABLE) of
        undefined -> [];
        _ ->
            Nodes = ets:foldl(fun({_H, N}, Acc) -> [N | Acc] end, [], ?TABLE),
            lists:usort(Nodes)
    end.

-spec status() -> #{members => [node()], replicas => pos_integer(), ring_entries => non_neg_integer()}.
status() ->
    Members = case ets:info(?TABLE) of
        undefined -> [];
        _ -> all_nodes()
    end,
    Entries = case ets:info(?TABLE, size) of
        undefined -> 0;
        N -> N
    end,
    #{members => Members, replicas => ?REPLICAS, ring_entries => Entries}.

%% ─── gen_server callbacks ──────────────────────────────────────────────────

-spec init([]) -> {ok, #state{}}.
init([]) ->
    process_flag(trap_exit, true),
    case ets:info(?TABLE) of
        undefined ->
            ets:new(?TABLE, [named_table, public, ordered_set, {read_concurrency, true}]);
        _ -> ok
    end,
    Members = lists:sort([node() | nodes()]),
    rebuild_ring(Members),
    ok = net_kernel:monitor_nodes(true, [{node_type, all}]),
    logger:notice("[hash_ring] initialized members=~p replicas=~p entries=~p",
                  [Members, ?REPLICAS, ets:info(?TABLE, size)]),
    {ok, #state{members = Members}}.

-spec handle_call(term(), gen_server:from(), #state{}) -> {reply, term(), #state{}}.
handle_call(get_members, _From, State) ->
    {reply, State#state.members, State};
handle_call(_Msg, _From, State) ->
    {reply, ok, State}.

-spec handle_cast(term(), #state{}) -> {noreply, #state{}}.
handle_cast(_Msg, State) ->
    {noreply, State}.

-spec handle_info(term(), #state{}) -> {noreply, #state{}}.
handle_info({nodeup, Node, _Info}, State) ->
    NewMembers = lists:usort([Node | State#state.members]),
    case NewMembers =:= State#state.members of
        true -> {noreply, State};
        false ->
            rebuild_ring(NewMembers),
            logger:notice("[hash_ring] nodeup ~p members=~p entries=~p",
                          [Node, NewMembers, ets:info(?TABLE, size)]),
            {noreply, State#state{members = NewMembers}}
    end;
handle_info({nodedown, Node, _Info}, State) ->
    NewMembers = State#state.members -- [Node],
    case NewMembers =:= State#state.members of
        true -> {noreply, State};
        false ->
            rebuild_ring(NewMembers),
            logger:warning("[hash_ring] nodedown ~p members=~p entries=~p",
                           [Node, NewMembers, ets:info(?TABLE, size)]),
            {noreply, State#state{members = NewMembers}}
    end;
handle_info(_Msg, State) ->
    {noreply, State}.

-spec terminate(term(), #state{}) -> ok.
terminate(_Reason, _State) ->
    ok.

-spec code_change(term(), #state{}, term()) -> {ok, #state{}}.
code_change(_OldVsn, State, _Extra) ->
    {ok, State}.

%% ─── Internal ──────────────────────────────────────────────────────────────

-spec rebuild_ring([node()]) -> ok.
rebuild_ring(Nodes) ->
    ets:delete_all_objects(?TABLE),
    lists:foreach(
        fun(Node) ->
            NodeBin = atom_to_binary(Node, utf8),
            lists:foreach(
                fun(I) ->
                    Key = <<NodeBin/binary, $:, (integer_to_binary(I))/binary>>,
                    Hash = erlang:phash2(Key, ?HASH_RANGE),
                    %% On (rare) collisions later replicas overwrite earlier ones —
                    %% that's fine, we just lose a virtual slot.
                    ets:insert(?TABLE, {Hash, Node})
                end,
                lists:seq(1, ?REPLICAS)
            )
        end,
        Nodes
    ),
    ok.

-spec phash(term()) -> non_neg_integer().
phash(K) when is_binary(K) ->
    erlang:phash2(K, ?HASH_RANGE);
phash(K) when is_integer(K) ->
    erlang:phash2(K, ?HASH_RANGE);
phash(K) ->
    erlang:phash2(K, ?HASH_RANGE).

-spec owner_for_hash(non_neg_integer()) -> node().
owner_for_hash(KeyHash) ->
    case ets:next(?TABLE, KeyHash) of
        '$end_of_table' ->
            %% Wrap to first entry on the ring.
            case ets:first(?TABLE) of
                '$end_of_table' -> node();
                FirstHash ->
                    [{_, Node}] = ets:lookup(?TABLE, FirstHash),
                    Node
            end;
        NextHash ->
            [{_, Node}] = ets:lookup(?TABLE, NextHash),
            Node
    end.
