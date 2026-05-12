/*
 * SPDX-License-Identifier: AGPL-3.0-or-later
 * Copyright (C) 2020-2026 Fluxer Contributors
 * Copyright (C) 2026 Floodilka Contributors
 * Modified by Floodilka Contributors starting March 2026. See LICENSE and NOTICE.
 */

import type {HonoApp} from '~/App';
import {GuildAuditLogController} from './GuildAuditLogController';
import {GuildBaseController} from './GuildBaseController';
import {GuildChannelController} from './GuildChannelController';
import {GuildEmojiController} from './GuildEmojiController';
import {GuildMemberController} from './GuildMemberController';
import {GuildRoleController} from './GuildRoleController';
import {GuildStickerController} from './GuildStickerController';

export const registerGuildControllers = (app: HonoApp) => {
	GuildBaseController(app);
	GuildMemberController(app);
	GuildRoleController(app);
	GuildChannelController(app);
	GuildEmojiController(app);
	GuildStickerController(app);
	GuildAuditLogController(app);
};
