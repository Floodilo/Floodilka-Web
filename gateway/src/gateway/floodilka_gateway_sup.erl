%% SPDX-License-Identifier: AGPL-3.0-or-later
%% Copyright (C) 2020-2026 Fluxer Contributors
%% Copyright (C) 2026 Floodilka Contributors
%% Modified by Floodilka Contributors starting March 2026. See LICENSE and NOTICE.

-module(floodilka_gateway_sup).
-behaviour(supervisor).
-export([start_link/0, init/1]).

start_link() ->
    supervisor:start_link({local, ?MODULE}, ?MODULE, []).

init([]) ->
    SessionManager = #{
        id => session_manager,
        start => {session_manager, start_link, []},
        restart => permanent,
        shutdown => 5000,
        type => worker
    },
    PresenceManager = #{
        id => presence_manager,
        start => {presence_manager, start_link, []},
        restart => permanent,
        shutdown => 5000,
        type => worker
    },
    GuildManager = #{
        id => guild_manager,
        start => {guild_manager, start_link, []},
        restart => permanent,
        shutdown => 5000,
        type => worker
    },
    Push = #{
        id => push,
        start => {push, start_link, []},
        restart => permanent,
        shutdown => 5000,
        type => worker
    },
    CallManager = #{
        id => call_manager,
        start => {call_manager, start_link, []},
        restart => permanent,
        shutdown => 5000,
        type => worker
    },
    PresenceBus = #{
        id => presence_bus,
        start => {presence_bus, start_link, []},
        restart => permanent,
        shutdown => 5000,
        type => worker
    },
    PresenceCache = #{
        id => presence_cache,
        start => {presence_cache, start_link, []},
        restart => permanent,
        shutdown => 5000,
        type => worker
    },
    GatewayMetricsCollector = #{
        id => gateway_metrics_collector,
        start => {gateway_metrics_collector, start_link, []},
        restart => permanent,
        shutdown => 5000,
        type => worker
    },
    ClusterBootstrap = #{
        id => cluster_bootstrap,
        start => {cluster_bootstrap, start_link, []},
        restart => permanent,
        shutdown => 5000,
        type => worker
    },
    HashRing = #{
        id => hash_ring,
        start => {hash_ring, start_link, []},
        restart => permanent,
        shutdown => 5000,
        type => worker
    },
    Pg = #{
        id => floodilka_pg,
        start => {pg, start_link, [gateway_pg:scope()]},
        restart => permanent,
        shutdown => 5000,
        type => worker
    },
    ManifoldSup = #{
        id => manifold_sup,
        start => {manifold_sup, start_link, []},
        restart => permanent,
        shutdown => 5000,
        type => supervisor
    },
    {ok,
        {{one_for_one, 5, 10}, [
            ClusterBootstrap,
            HashRing,
            Pg,
            ManifoldSup,
            SessionManager,
            PresenceCache,
            PresenceBus,
            PresenceManager,
            GuildManager,
            CallManager,
            Push,
            GatewayMetricsCollector
        ]}}.
