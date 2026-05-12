%% SPDX-License-Identifier: AGPL-3.0-or-later
%% Copyright (C) 2020-2026 Fluxer Contributors
%% Copyright (C) 2026 Floodilka Contributors
%% Modified by Floodilka Contributors starting March 2026. See LICENSE and NOTICE.

-module(gateway_rpc_router).

-export([execute/2]).

execute(Method, Params) ->
    case Method of
        <<"guild.", _/binary>> ->
            gateway_rpc_guild:execute_method(Method, Params);
        <<"presence.", _/binary>> ->
            gateway_rpc_presence:execute_method(Method, Params);
        <<"push.", _/binary>> ->
            gateway_rpc_push:execute_method(Method, Params);
        <<"call.", _/binary>> ->
            gateway_rpc_call:execute_method(Method, Params);
        <<"voice.", _/binary>> ->
            gateway_rpc_voice:execute_method(Method, Params);
        <<"process.", _/binary>> ->
            gateway_rpc_misc:execute_method(Method, Params);
        _ ->
            throw({error, <<"Unknown method: ", Method/binary>>})
    end.
