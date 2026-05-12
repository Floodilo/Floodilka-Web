%% SPDX-License-Identifier: AGPL-3.0-or-later
%% Copyright (C) 2020-2026 Fluxer Contributors
%% Copyright (C) 2026 Floodilka Contributors
%% Modified by Floodilka Contributors starting March 2026. See LICENSE and NOTICE.

-module(custom_status_validation).

-export([
    validate/2
]).

-spec validate(integer(), map() | null) -> {ok, map()} | {error, term()}.
validate(_UserId, null) ->
    {ok, null};
validate(UserId, CustomStatus) when is_map(CustomStatus) ->
    Request = build_request(UserId, CustomStatus),
    rpc_client:call(Request).

build_request(UserId, CustomStatus) ->
    #{
        <<"type">> => <<"validate_custom_status">>,
        <<"user_id">> => type_conv:to_binary(UserId),
        <<"custom_status">> => build_custom_status_payload(CustomStatus)
    }.

build_custom_status_payload(CustomStatus) ->
    Field1 = put_optional_field(
        maps:new(),
        <<"text">>,
        maps:get(<<"text">>, CustomStatus, undefined)
    ),
    Field2 = put_optional_field(
        Field1,
        <<"expires_at">>,
        maps:get(<<"expires_at">>, CustomStatus, undefined)
    ),
    Field3 = put_optional_field(
        Field2,
        <<"emoji_id">>,
        maps:get(<<"emoji_id">>, CustomStatus, undefined)
    ),
    put_optional_field(
        Field3,
        <<"emoji_name">>,
        maps:get(<<"emoji_name">>, CustomStatus, undefined)
    ).

put_optional_field(Map, _Key, undefined) ->
    Map;
put_optional_field(Map, Key, Value) ->
    maps:put(Key, Value, Map).
