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

%% @doc Cluster-wide aggregation helpers for admin / metrics endpoints.
%%
%% Each X_manager.handle_call(get_global_count, _, S) only counts entries
%% on the local node. Pre-cluster that was equivalent to "global" because
%% the gateway was single-node; at replicas:3 every node holds ~1/3 of
%% sessions, presences, calls, and so on, so the admin dashboard / metrics
%% would silently show local-only numbers and the user-visible state
%% (online list, voice monitor) would be wrong on whichever node the
%% admin RPC happened to land.
%%
%% sum_call/3 broadcasts a gen_server:call to a registered name on every
%% known cluster member (including self) using parallel rpc, sums the
%% integer answers, and ignores nodes that don't respond. Total wall
%% time is bounded by the per-call timeout (5s default).
%%
%% collect_call/3 does the same but flat-collates list answers — used by
%% endpoints like `process.get_all_voice_states` that need the union of
%% lists from every node.
%%
%% These helpers are intentionally thin: a couple of erpc calls plus
%% folding. No long-lived state, no supervisor child.

-module(cluster_stats).

-export([sum_call/2, sum_call/3, collect_call/2, collect_call/3]).

-define(DEFAULT_TIMEOUT, 5000).

-spec sum_call(atom(), term()) -> non_neg_integer().
sum_call(RegisteredName, Request) ->
    sum_call(RegisteredName, Request, ?DEFAULT_TIMEOUT).

-spec sum_call(atom(), term(), pos_integer()) -> non_neg_integer().
sum_call(RegisteredName, Request, Timeout) ->
    Results = call_all_nodes(RegisteredName, Request, Timeout),
    lists:foldl(
        fun
            ({ok, N}, Acc) when is_integer(N) -> Acc + N;
            (_, Acc) -> Acc
        end,
        0,
        Results
    ).

-spec collect_call(atom(), term()) -> [term()].
collect_call(RegisteredName, Request) ->
    collect_call(RegisteredName, Request, ?DEFAULT_TIMEOUT).

-spec collect_call(atom(), term(), pos_integer()) -> [term()].
collect_call(RegisteredName, Request, Timeout) ->
    Results = call_all_nodes(RegisteredName, Request, Timeout),
    lists:foldl(
        fun
            ({ok, List}, Acc) when is_list(List) -> List ++ Acc;
            (List, Acc) when is_list(List) -> List ++ Acc;
            (_, Acc) -> Acc
        end,
        [],
        Results
    ).

%% ─── Internal ──────────────────────────────────────────────────────────────

-spec call_all_nodes(atom(), term(), pos_integer()) -> [term()].
call_all_nodes(RegisteredName, Request, Timeout) ->
    Nodes = [node() | nodes()],
    lists:map(
        fun(Node) ->
            try erpc:call(Node, gen_server, call, [RegisteredName, Request, Timeout], Timeout + 1000) of
                Reply -> Reply
            catch
                _:_ -> {error, unavailable}
            end
        end,
        Nodes
    ).
