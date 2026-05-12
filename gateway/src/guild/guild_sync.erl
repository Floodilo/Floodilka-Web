%% SPDX-License-Identifier: AGPL-3.0-or-later
%% Copyright (C) 2020-2026 Fluxer Contributors
%% Copyright (C) 2026 Floodilka Contributors
%% Modified by Floodilka Contributors starting March 2026. See LICENSE and NOTICE.

-module(guild_sync).

-export([send_guild_sync/2]).

send_guild_sync(GuildPid, SessionId) ->
    gen_server:cast(GuildPid, {send_guild_sync, SessionId}).
