%% SPDX-License-Identifier: AGPL-3.0-or-later
%% Copyright (C) 2020-2026 Fluxer Contributors
%% Copyright (C) 2026 Floodilka Contributors
%% Modified by Floodilka Contributors starting March 2026. See LICENSE and NOTICE.

-module(rpc_client).

-export([
    call/1,
    call/2,
    get_rpc_url/0,
    get_rpc_url/1,
    get_rpc_headers/0
]).

-type rpc_request() :: map().
-type rpc_response() :: {ok, map()} | {error, term()}.

-spec call(rpc_request()) -> rpc_response().
call(Request) ->
    call(Request, #{}).

-spec call(rpc_request(), map()) -> rpc_response().
call(Request, _Options) ->
    Url = get_rpc_url(),
    Headers = get_rpc_headers(),
    Body = jsx:encode(Request),

    case
        hackney:request(post, Url, Headers, Body, [{recv_timeout, 30000}, {connect_timeout, 5000}])
    of
        {ok, 200, _RespHeaders, ClientRef} ->
            case hackney:body(ClientRef) of
                {ok, RespBody} ->
                    Response = jsx:decode(RespBody, [return_maps]),
                    Data = maps:get(<<"data">>, Response, #{}),
                    {ok, Data};
                {error, Reason} ->
                    logger:error("[rpc_client] Failed to read response body: ~p", [Reason]),
                    {error, {body_read_failed, Reason}}
            end;
        {ok, StatusCode, _RespHeaders, ClientRef} ->
            case hackney:body(ClientRef) of
                {ok, RespBody} ->
                    hackney:close(ClientRef),
                    logger:error("[rpc_client] RPC request failed with status ~p: ~s", [
                        StatusCode, RespBody
                    ]),
                    {error, {http_error, StatusCode, RespBody}};
                {error, Reason} ->
                    hackney:close(ClientRef),
                    logger:error(
                        "[rpc_client] Failed to read error response body (status ~p): ~p", [
                            StatusCode, Reason
                        ]
                    ),
                    {error, {http_error, StatusCode, body_read_failed}}
            end;
        {error, Reason} ->
            logger:error("[rpc_client] RPC request failed: ~p", [Reason]),
            {error, Reason}
    end.

get_rpc_url() ->
    ApiHost = floodilka_gateway_env:get(api_host),
    get_rpc_url(ApiHost).

get_rpc_url(ApiHost) ->
    "http://" ++ ApiHost ++ "/_rpc".

get_rpc_headers() ->
    RpcSecretKey = floodilka_gateway_env:get(rpc_secret_key),
    [{<<"Authorization">>, <<"Bearer ", RpcSecretKey/binary>>}].
