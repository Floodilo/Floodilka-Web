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

%% @doc Owner-aware routing layer in front of the local presence_manager.
%%
%% Discord-pattern step 6 — every user has exactly one presence_session,
%% on the node selected by hash_ring:owner_node(UserId). All of a user's
%% sessions (multiple devices, possibly across multiple gateway nodes
%% thanks to sticky-routing on Authorization header) connect to that
%% single presence_session through Erlang distribution. Without this
%% gate, two gateway replicas could each spawn an independent
%% presence_session for the same user — one device sees device-A
%% online, another sees device-B online, neither sees both. That was
%% the user-visible "different users on each refresh" symptom of the
%% reverted 7.11 cutover.
%%
%% The Pids returned by lookup/start_or_lookup are valid cluster-wide,
%% so subsequent gen_server:call(PresencePid, ...) and gen_server:cast
%% (used heavily by session_connect, sync_friends, sync_group_dm) work
%% transparently regardless of which node holds the presence_session.
%%
%% Distribution-specific exits (nodedown, noproc, timeout) are
%% normalised to {error, owner_unavailable | owner_down | timeout}
%% — the presence callsites already handle clean error tuples.
%%
%% At replicas: 1 every key resolves to node(), so this is a passthrough.

-module(presence_router).

-include_lib("floodilka_gateway/include/timeout_config.hrl").

-export([
    lookup/1,
    lookup/2,
    start_or_lookup/2,
    start_or_lookup/3,
    dispatch_to_user/3,
    dispatch_to_user/4,
    terminate_all_sessions/1,
    terminate_all_sessions/2,
    owner_node/1,
    is_local/1
]).

-type user_id() :: integer().
-type event_type() :: atom() | binary().

-define(PRESENCE_MANAGER, presence_manager).

-spec lookup(user_id()) -> {ok, pid()} | {error, term()}.
lookup(UserId) ->
    lookup(UserId, ?DEFAULT_GEN_SERVER_TIMEOUT).

-spec lookup(user_id(), pos_integer()) -> {ok, pid()} | {error, term()}.
lookup(UserId, Timeout) ->
    route_call(UserId, {lookup, UserId}, Timeout).

-spec start_or_lookup(user_id(), map()) -> {ok, pid()} | {error, term()}.
start_or_lookup(UserId, RequestMap) ->
    start_or_lookup(UserId, RequestMap, ?DEFAULT_GEN_SERVER_TIMEOUT).

-spec start_or_lookup(user_id(), map(), pos_integer()) -> {ok, pid()} | {error, term()}.
start_or_lookup(UserId, RequestMap, Timeout) when is_map(RequestMap) ->
    NormalizedReq = maps:put(user_id, UserId, RequestMap),
    route_call(UserId, {start_or_lookup, NormalizedReq}, Timeout).

-spec dispatch_to_user(user_id(), event_type(), term()) -> ok | {error, term()}.
dispatch_to_user(UserId, Event, Data) ->
    dispatch_to_user(UserId, Event, Data, ?DEFAULT_GEN_SERVER_TIMEOUT).

-spec dispatch_to_user(user_id(), event_type(), term(), pos_integer()) -> ok | {error, term()}.
dispatch_to_user(UserId, Event, Data, Timeout) ->
    route_call(UserId, {dispatch, UserId, Event, Data}, Timeout).

-spec terminate_all_sessions(user_id()) -> ok | {error, term()}.
terminate_all_sessions(UserId) ->
    terminate_all_sessions(UserId, ?DEFAULT_GEN_SERVER_TIMEOUT).

-spec terminate_all_sessions(user_id(), pos_integer()) -> ok | {error, term()}.
terminate_all_sessions(UserId, Timeout) ->
    route_call(UserId, {terminate_all_sessions, UserId}, Timeout).

-spec owner_node(user_id()) -> node().
owner_node(UserId) ->
    hash_ring:owner_node(UserId).

-spec is_local(user_id()) -> boolean().
is_local(UserId) ->
    hash_ring:owner_node(UserId) =:= node().

%% ─── Internal ──────────────────────────────────────────────────────────────

-spec route_call(user_id(), term(), pos_integer()) -> term().
route_call(UserId, Request, Timeout) ->
    Owner = hash_ring:owner_node(UserId),
    Self = node(),
    case Owner of
        Self ->
            gen_server:call(?PRESENCE_MANAGER, Request, Timeout);
        Remote ->
            try gen_server:call({?PRESENCE_MANAGER, Remote}, Request, Timeout) of
                Reply -> Reply
            catch
                exit:{noproc, _} -> {error, owner_unavailable};
                exit:{nodedown, _} -> {error, owner_down};
                exit:{{nodedown, _}, _} -> {error, owner_down};
                exit:{timeout, _} -> {error, timeout};
                exit:Reason -> {error, {router_exit, Reason}}
            end
    end.
