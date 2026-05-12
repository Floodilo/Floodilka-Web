%% SPDX-License-Identifier: AGPL-3.0-or-later
%% Copyright (C) 2020-2026 Fluxer Contributors
%% Copyright (C) 2026 Floodilka Contributors
%% Modified by Floodilka Contributors starting March 2026. See LICENSE and NOTICE.

-module(floodilka_gateway_app).
-behaviour(application).
-export([start/2, stop/1]).

start(_StartType, _StartArgs) ->
    floodilka_gateway_env:load(),

    WsPort = floodilka_gateway_env:get(ws_port),
    RpcPort = floodilka_gateway_env:get(rpc_port),

    Dispatch = cowboy_router:compile([
        {'_', [
            {<<"/_health">>, health_handler, []},
            {<<"/">>, gateway_handler, []}
        ]}
    ]),

    {ok, _} = cowboy:start_clear(http,
        #{
            socket_opts => [{port, WsPort}],
            max_connections => infinity,
            num_acceptors => 100
        },
        #{
            env => #{dispatch => Dispatch},
            max_frame_size => 4096
        }
    ),

    RpcDispatch = cowboy_router:compile([
        {'_', [
            {<<"/_rpc">>, gateway_rpc_http_handler, []},
            {<<"/_admin/reload">>, hot_reload_handler, []}
        ]}
    ]),

    {ok, _} = cowboy:start_clear(rpc_http,
        #{
            socket_opts => [{port, RpcPort}],
            max_connections => infinity,
            num_acceptors => 100
        },
        #{
            env => #{dispatch => RpcDispatch}
        }
    ),

    floodilka_gateway_sup:start_link().

stop(_State) ->
    ok.
