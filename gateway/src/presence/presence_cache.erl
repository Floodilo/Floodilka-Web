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

%% @doc Per-user presence cache, cluster-replicated via cluster_state_replicator.
%%
%% Phase 7.13b — was previously a sharded gen_server with per-node ETS only.
%% Now public reads go straight against the replicated `presence` topic ETS.
%% Writes go through cluster_state_replicator (single gen_server per topic),
%% which broadcasts {update, K, Entry} to all peer gateways via pg.
%%
%% On the wire we store the same Erlang map the previous implementation did;
%% only the storage backend changed.

-module(presence_cache).
-behaviour(gen_server).

-compile({no_auto_import, [get/1, put/2]}).

-export([start_link/0, put/2, delete/1, get/1, bulk_get/1, get_memory_stats/0, get_all_user_ids/0]).
-export([init/1, handle_call/3, handle_cast/2, handle_info/2, terminate/2, code_change/3]).

-define(TOPIC, presence).

%% ─── Public API ────────────────────────────────────────────────────────────

-spec start_link() -> {ok, pid()} | {error, term()}.
start_link() ->
    gen_server:start_link({local, ?MODULE}, ?MODULE, [], []).

-spec put(integer(), map()) -> ok.
put(UserId, Presence) when is_integer(UserId), is_map(Presence) ->
    %% Preserve previous semantics: storing an offline/invisible presence is a
    %% delete from the visible cache. The original sharded implementation in
    %% presence_cache_shard:do_put/3 worked the same way.
    case maps:get(<<"status">>, Presence, <<"offline">>) of
        <<"offline">> -> cluster_state_replicator:delete(?TOPIC, UserId);
        <<"invisible">> -> cluster_state_replicator:delete(?TOPIC, UserId);
        _Visible -> cluster_state_replicator:put(?TOPIC, UserId, Presence)
    end.

-spec delete(integer()) -> ok.
delete(UserId) when is_integer(UserId) ->
    cluster_state_replicator:delete(?TOPIC, UserId).

-spec get(integer()) -> {ok, map()} | not_found.
get(UserId) when is_integer(UserId) ->
    case cluster_state_replicator:get(?TOPIC, UserId) of
        undefined -> not_found;
        Presence when is_map(Presence) -> {ok, Presence}
    end.

-spec bulk_get([integer()]) -> [map()].
bulk_get(UserIds) when is_list(UserIds) ->
    Map = cluster_state_replicator:bulk_get(?TOPIC, UserIds),
    %% Preserve old contract: list of presence maps for users that were found,
    %% deduplicated. Caller doesn't get user_id back — it's already in the
    %% presence map under <<"user">>.<<"id">> per the upstream protocol.
    maps:values(Map).

-spec get_memory_stats() -> {ok, map()}.
get_memory_stats() ->
    Table = cluster_state_replicator_table(?TOPIC),
    WordSize = erlang:system_info(wordsize),
    {Memory, EntryCount} = case ets:info(Table) of
        undefined ->
            {0, 0};
        Info ->
            MemWords = proplists:get_value(memory, Info, 0),
            Size = proplists:get_value(size, Info, 0),
            {MemWords * WordSize, Size}
    end,
    {ok, #{memory_bytes => Memory, entry_count => EntryCount}}.

-spec get_all_user_ids() -> [integer()].
get_all_user_ids() ->
    [UserId || {UserId, _Presence} <- cluster_state_replicator:get_all(?TOPIC)].

%% ─── gen_server callbacks (kept for supervisor compatibility) ──────────────

-spec init([]) -> {ok, #{}}.
init([]) ->
    process_flag(trap_exit, true),
    %% cluster_state_replicator for the presence topic is started as its own
    %% supervised child. This gen_server stays as a registered name so the
    %% rest of the codebase can still call presence_cache:* without knowing
    %% the storage moved.
    logger:info("[presence_cache] facade over cluster_state_replicator(~p) ready", [?TOPIC]),
    {ok, #{}}.

handle_call(_Msg, _From, State) ->
    {reply, ok, State}.

handle_cast(_Msg, State) ->
    {noreply, State}.

handle_info(_Msg, State) ->
    {noreply, State}.

terminate(_Reason, _State) ->
    ok.

code_change(_OldVsn, State, _Extra) ->
    {ok, State}.

%% ─── Internal ──────────────────────────────────────────────────────────────

cluster_state_replicator_table(Topic) ->
    list_to_atom("cluster_state_tab_" ++ atom_to_list(Topic)).
