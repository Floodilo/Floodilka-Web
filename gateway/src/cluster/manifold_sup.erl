%% SPDX-License-Identifier: AGPL-3.0-or-later
%% Copyright (C) 2020-2026 Fluxer Contributors
%% Copyright (C) 2026 Floodilka Contributors
%% Modified by Floodilka Contributors starting March 2026. See LICENSE and NOTICE.

%% @doc Supervisor for manifold partition workers — one child per partition.

-module(manifold_sup).
-behaviour(supervisor).

-export([start_link/0, init/1]).

start_link() ->
    supervisor:start_link({local, ?MODULE}, ?MODULE, []).

init([]) ->
    Children = [
        #{
            id => manifold:partition_name(I),
            start => {manifold_partition, start_link, [I]},
            restart => permanent,
            shutdown => 5000,
            type => worker
        }
     || I <- lists:seq(0, manifold:partitions() - 1)
    ],
    {ok, {{one_for_one, 10, 10}, Children}}.
