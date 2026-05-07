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

%% @doc Owner-aware routing layer in front of the local call_manager.
%%
%% Voice rooms (each tied to a channel_id) live on exactly one node — the
%% one selected by hash_ring:owner_node(ChannelId). This module is the
%% only place callers should reach call_manager from; it transparently
%% hops to the owning node via Erlang distribution when this isn't us.
%%
%% Pids returned by lookup/create/get_or_create are valid cluster-wide,
%% so subsequent gen_server:call(CallPid, _) — used heavily by RPC
%% endpoints to drive call:join/leave/ring/etc. — works regardless of
%% which node holds the call process.
%%
%% Hashing is by ChannelId, not GuildId. A voice channel's lifetime and
%% participant set are independent of the rest of its guild, and a guild
%% with many voice channels gets its load spread across the cluster
%% instead of pinned to one node.
%%
%% At replicas: 1 the ring resolves every key to node(), so this layer
%% is a passthrough.

-module(call_router).

-include_lib("floodilka_gateway/include/timeout_config.hrl").

-export([
    lookup/1,
    lookup/2,
    create/2,
    create/3,
    get_or_create/2,
    get_or_create/3,
    terminate_call/1,
    terminate_call/2,
    owner_node/1,
    is_local/1
]).

-type channel_id() :: integer().
-type call_data() :: map().

-define(CALL_MANAGER, call_manager).
-define(LOOKUP_TIMEOUT, ?SESSION_CALL_TIMEOUT).
-define(CREATE_TIMEOUT, ?GUILD_CALL_TIMEOUT).

-spec lookup(channel_id()) -> {ok, pid()} | {error, term()}.
lookup(ChannelId) ->
    lookup(ChannelId, ?LOOKUP_TIMEOUT).

-spec lookup(channel_id(), pos_integer()) -> {ok, pid()} | {error, term()}.
lookup(ChannelId, Timeout) ->
    route_call(ChannelId, {lookup, ChannelId}, Timeout).

-spec create(channel_id(), call_data()) -> {ok, pid()} | {error, term()}.
create(ChannelId, CallData) ->
    create(ChannelId, CallData, ?CREATE_TIMEOUT).

-spec create(channel_id(), call_data(), pos_integer()) -> {ok, pid()} | {error, term()}.
create(ChannelId, CallData, Timeout) ->
    route_call(ChannelId, {create, ChannelId, CallData}, Timeout).

-spec get_or_create(channel_id(), call_data()) -> {ok, pid()} | {error, term()}.
get_or_create(ChannelId, CallData) ->
    get_or_create(ChannelId, CallData, ?CREATE_TIMEOUT).

-spec get_or_create(channel_id(), call_data(), pos_integer()) -> {ok, pid()} | {error, term()}.
get_or_create(ChannelId, CallData, Timeout) ->
    route_call(ChannelId, {get_or_create, ChannelId, CallData}, Timeout).

-spec terminate_call(channel_id()) -> ok | {error, term()}.
terminate_call(ChannelId) ->
    terminate_call(ChannelId, ?LOOKUP_TIMEOUT).

-spec terminate_call(channel_id(), pos_integer()) -> ok | {error, term()}.
terminate_call(ChannelId, Timeout) ->
    route_call(ChannelId, {terminate_call, ChannelId}, Timeout).

-spec owner_node(channel_id()) -> node().
owner_node(ChannelId) ->
    hash_ring:owner_node(ChannelId).

-spec is_local(channel_id()) -> boolean().
is_local(ChannelId) ->
    hash_ring:owner_node(ChannelId) =:= node().

%% ─── Internal ──────────────────────────────────────────────────────────────

-spec route_call(channel_id(), term(), pos_integer()) -> term().
route_call(ChannelId, Request, Timeout) ->
    Owner = hash_ring:owner_node(ChannelId),
    Self = node(),
    case Owner of
        Self ->
            gen_server:call(?CALL_MANAGER, Request, Timeout);
        Remote ->
            try gen_server:call({?CALL_MANAGER, Remote}, Request, Timeout) of
                Reply -> Reply
            catch
                exit:{noproc, _} -> {error, owner_unavailable};
                exit:{nodedown, _} -> {error, owner_down};
                exit:{{nodedown, _}, _} -> {error, owner_down};
                exit:{timeout, _} -> {error, timeout};
                exit:Reason -> {error, {router_exit, Reason}}
            end
    end.
