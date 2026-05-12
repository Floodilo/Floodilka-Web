%% SPDX-License-Identifier: AGPL-3.0-or-later
%% Copyright (C) 2020-2026 Fluxer Contributors
%% Copyright (C) 2026 Floodilka Contributors
%% Modified by Floodilka Contributors starting March 2026. See LICENSE and NOTICE.

-module(gateway_rpc_push).

-export([execute_method/2]).

execute_method(<<"push.sync_user_guild_settings">>, #{
    <<"user_id">> := UserIdBin,
    <<"guild_id">> := GuildIdBin,
    <<"user_guild_settings">> := UserGuildSettings
}) ->
    UserId = validation:snowflake_or_throw(<<"user_id">>, UserIdBin),
    GuildId = validation:snowflake_or_throw(<<"guild_id">>, GuildIdBin),
    push:sync_user_guild_settings(UserId, GuildId, UserGuildSettings),
    true;
execute_method(<<"push.sync_user_blocked_ids">>, #{
    <<"user_id">> := UserIdBin, <<"blocked_user_ids">> := BlockedUserIds
}) ->
    UserId = validation:snowflake_or_throw(<<"user_id">>, UserIdBin),
    BlockedIds = validation:snowflake_list_or_throw(<<"blocked_user_ids">>, BlockedUserIds),
    push:sync_user_blocked_ids(UserId, BlockedIds),
    true;
execute_method(<<"push.invalidate_badge_count">>, #{
    <<"user_id">> := UserIdBin
}) ->
    UserId = validation:snowflake_or_throw(<<"user_id">>, UserIdBin),
    push:invalidate_user_badge_count(UserId),
    true.
