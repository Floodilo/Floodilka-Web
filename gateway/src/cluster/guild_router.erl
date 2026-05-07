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

%% @doc Owner-aware routing layer in front of the local guild_manager.
%%
%% Discord-pattern step 2: every guild has exactly one owner node — the node
%% selected by hash_ring:owner_node(GuildId). When code on any gateway node
%% needs the guild process, it calls guild_router instead of guild_manager:
%%
%%   guild_router:start_or_lookup(GuildId) returns {ok, GuildPid}
%%
%% If we're the owner, the call goes straight to the local guild_manager
%% gen_server (current API surface). Otherwise it hops via Erlang distribution
%% to the owner node's `guild_manager` registered name. The returned Pid is
%% valid cluster-wide — gen_server:call(Pid, _) just works regardless of
%% where the caller and the guild process live.
%%
%% Failures peculiar to the cross-node call are normalised to clean error
%% tuples so callers don't need to handle exit signals from gen_server:call.
%%
%% At single-replica scale (current prod) hash_ring:owner_node always returns
%% node(), so this layer is a passthrough.

-module(guild_router).

-include_lib("floodilka_gateway/include/timeout_config.hrl").

-export([
    start_or_lookup/1,
    start_or_lookup/2,
    lookup/1,
    lookup/2,
    owner_node/1,
    is_local/1
]).

-type guild_id() :: integer().

-define(GUILD_MANAGER, guild_manager).

-spec start_or_lookup(guild_id()) -> {ok, pid()} | {error, term()}.
start_or_lookup(GuildId) ->
    start_or_lookup(GuildId, ?DEFAULT_GEN_SERVER_TIMEOUT).

-spec start_or_lookup(guild_id(), pos_integer()) -> {ok, pid()} | {error, term()}.
start_or_lookup(GuildId, Timeout) ->
    route_call(GuildId, {start_or_lookup, GuildId}, Timeout).

-spec lookup(guild_id()) -> {ok, pid()} | {error, term()}.
lookup(GuildId) ->
    lookup(GuildId, ?DEFAULT_GEN_SERVER_TIMEOUT).

-spec lookup(guild_id(), pos_integer()) -> {ok, pid()} | {error, term()}.
lookup(GuildId, Timeout) ->
    route_call(GuildId, {lookup, GuildId}, Timeout).

-spec owner_node(guild_id()) -> node().
owner_node(GuildId) ->
    hash_ring:owner_node(GuildId).

-spec is_local(guild_id()) -> boolean().
is_local(GuildId) ->
    hash_ring:is_local(GuildId).

%% ─── Internal ──────────────────────────────────────────────────────────────

-spec route_call(guild_id(), term(), pos_integer()) -> term().
route_call(GuildId, Request, Timeout) ->
    Owner = hash_ring:owner_node(GuildId),
    Self = node(),
    case Owner of
        Self ->
            gen_server:call(?GUILD_MANAGER, Request, Timeout);
        Remote ->
            try gen_server:call({?GUILD_MANAGER, Remote}, Request, Timeout) of
                Reply -> Reply
            catch
                exit:{noproc, _} -> {error, owner_unavailable};
                exit:{nodedown, _} -> {error, owner_down};
                exit:{{nodedown, _}, _} -> {error, owner_down};
                exit:{timeout, _} -> {error, timeout};
                exit:Reason -> {error, {router_exit, Reason}}
            end
    end.
