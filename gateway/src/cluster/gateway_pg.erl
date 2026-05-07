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

%% @doc Cluster-wide subscription registry built on Erlang's pg.
%%
%% Discord-pattern step 5a — every fan-out target (a session, a voice
%% participant, a presence subscriber) joins a named group; whoever needs
%% to broadcast asks pg for the current member list and hands the pids to
%% manifold:send/2 for batched delivery.
%%
%% Why pg over guild_process state:
%%   - O(1) join/leave from any node, no round-trip to a centralised owner.
%%   - get_members/2 returns pids on every node — exactly the input shape
%%     manifold needs to group by node before forwarding.
%%   - pg cleans up automatically when a member's node disconnects, so
%%     stale subscribers don't linger after a netsplit.
%%
%% All groups live in the named scope ?SCOPE so we don't collide with any
%% other library's default-scope usage. The pg scope manager is started
%% as a sibling of this module under the gateway supervisor.

-module(gateway_pg).

-export([
    scope/0,
    join/2,
    leave/2,
    members/1,
    local_members/1,
    monitor_group/1,
    demonitor_group/1
]).

-define(SCOPE, floodilka_pg).

-type group() :: term().

-spec scope() -> atom().
scope() -> ?SCOPE.

-spec join(group(), pid() | [pid()]) -> ok.
join(Group, PidOrPids) ->
    pg:join(?SCOPE, Group, PidOrPids).

-spec leave(group(), pid() | [pid()]) -> ok | not_joined.
leave(Group, PidOrPids) ->
    pg:leave(?SCOPE, Group, PidOrPids).

%% @doc Returns pids in the group across the entire cluster — local and remote.
-spec members(group()) -> [pid()].
members(Group) ->
    pg:get_members(?SCOPE, Group).

%% @doc Local pids only. Useful for diagnostics or local-only fan-out.
-spec local_members(group()) -> [pid()].
local_members(Group) ->
    pg:get_local_members(?SCOPE, Group).

%% @doc Subscribe the calling process to membership-change notifications.
%% Returns the initial member list and a reference; use demonitor_group/1
%% to unsubscribe.
-spec monitor_group(group()) -> {reference(), [pid()]}.
monitor_group(Group) ->
    pg:monitor(?SCOPE, Group).

-spec demonitor_group(reference()) -> ok | false.
demonitor_group(Ref) ->
    pg:demonitor(?SCOPE, Ref).
