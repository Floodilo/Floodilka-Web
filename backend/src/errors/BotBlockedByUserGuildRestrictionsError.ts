/*
 * SPDX-License-Identifier: AGPL-3.0-or-later
 * Copyright (C) 2020-2026 Fluxer Contributors
 * Copyright (C) 2026 Floodilka Contributors
 * Modified by Floodilka Contributors starting March 2026. See LICENSE and NOTICE.
 */

import {ForbiddenError} from './ForbiddenError';

export class BotBlockedByUserGuildRestrictionsError extends ForbiddenError {
	constructor() {
		super({
			code: 'BOT_BLOCKED_BY_USER_GUILD_RESTRICTIONS',
			message: 'Добавление ботов в этот сервер запрещено вашими настройками',
		});
	}
}
