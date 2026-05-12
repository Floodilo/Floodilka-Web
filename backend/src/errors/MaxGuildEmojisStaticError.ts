/*
 * SPDX-License-Identifier: AGPL-3.0-or-later
 * Copyright (C) 2020-2026 Fluxer Contributors
 * Copyright (C) 2026 Floodilka Contributors
 * Modified by Floodilka Contributors starting March 2026. See LICENSE and NOTICE.
 */

import {APIErrorCodes, MAX_GUILD_EMOJIS_STATIC} from '~/Constants';
import {BadRequestError} from './BadRequestError';

export class MaxGuildEmojisStaticError extends BadRequestError {
	constructor() {
		super({
			code: APIErrorCodes.MAX_EMOJIS,
			message: `Достигнуто максимальное количество статичных эмодзи (${MAX_GUILD_EMOJIS_STATIC}).`,
		});
	}
}
