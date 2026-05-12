%% SPDX-License-Identifier: AGPL-3.0-or-later
%% Copyright (C) 2020-2026 Fluxer Contributors
%% Copyright (C) 2026 Floodilka Contributors
%% Modified by Floodilka Contributors starting March 2026. See LICENSE and NOTICE.

-module(user_utils).

-export([normalize_user/1]).

normalize_user(User) when is_map(User) ->
    AllowedKeys = [
        <<"id">>,
        <<"username">>,
        <<"global_name">>,
        <<"avatar">>,
        <<"avatar_color">>,
        <<"bot">>,
        <<"system">>,
        <<"flags">>,
        <<"banner">>,
        <<"banner_color">>,
        <<"nameplate">>,
        <<"premium_type">>
    ],
    CleanPairs =
        lists:foldl(
            fun(Key, Acc) ->
                Value = maps:get(Key, User, undefined),
                case is_undefined(Value) of
                    true -> Acc;
                    false -> [{Key, Value} | Acc]
                end
            end,
            [],
            AllowedKeys
        ),
    maps:from_list(lists:reverse(CleanPairs));
normalize_user(_) ->
    #{}.

is_undefined(undefined) -> true;
is_undefined(_) -> false.
