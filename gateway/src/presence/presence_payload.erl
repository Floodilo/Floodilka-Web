%% SPDX-License-Identifier: AGPL-3.0-or-later
%% Copyright (C) 2020-2026 Fluxer Contributors
%% Copyright (C) 2026 Floodilka Contributors
%% Modified by Floodilka Contributors starting March 2026. See LICENSE and NOTICE.

-module(presence_payload).

-export([build/5]).

build(UserData, Status, Mobile, Afk, CustomStatus) ->
    StatusBin = ensure_status_binary(Status),
    #{
        <<"user">> => user_utils:normalize_user(UserData),
        <<"status">> => StatusBin,
        <<"mobile">> => Mobile,
        <<"afk">> => Afk,
        <<"custom_status">> => custom_status_for(StatusBin, CustomStatus)
    }.

ensure_status_binary(Status) when is_atom(Status) ->
    constants:status_type_atom(Status);
ensure_status_binary(Status) when is_binary(Status) ->
    Status;
ensure_status_binary(_) ->
    <<"offline">>.

custom_status_for(StatusBin, CustomStatus) ->
    case StatusBin of
        <<"offline">> ->
            null;
        <<"invisible">> ->
            null;
        _ ->
            normalize_custom_status(CustomStatus)
    end.

normalize_custom_status(null) ->
    null;
normalize_custom_status(CustomStatus) when is_map(CustomStatus) ->
    CustomStatus;
normalize_custom_status(_) ->
    null.
