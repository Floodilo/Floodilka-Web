%% SPDX-License-Identifier: AGPL-3.0-or-later
%% Copyright (C) 2020-2026 Fluxer Contributors
%% Copyright (C) 2026 Floodilka Contributors
%% Modified by Floodilka Contributors starting March 2026. See LICENSE and NOTICE.

-module(push_core).

-export([handle_message_create/1]).
-export([sync_user_guild_settings/3]).
-export([sync_user_blocked_ids/2]).

handle_message_create(Params) ->
    PushEnabled = floodilka_gateway_env:get(push_enabled),
    case PushEnabled of
        true ->
            gen_server:cast(push, {handle_message_create, Params});
        false ->
            ok
    end.

sync_user_guild_settings(UserId, GuildId, UserGuildSettings) ->
    gen_server:cast(push, {sync_user_guild_settings, UserId, GuildId, UserGuildSettings}).

sync_user_blocked_ids(UserId, BlockedIds) ->
    gen_server:cast(push, {sync_user_blocked_ids, UserId, BlockedIds}).
