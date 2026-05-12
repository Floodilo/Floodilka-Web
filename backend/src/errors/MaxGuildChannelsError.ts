/*
 * SPDX-License-Identifier: AGPL-3.0-or-later
 * Copyright (C) 2020-2026 Fluxer Contributors
 * Copyright (C) 2026 Floodilka Contributors
 * Modified by Floodilka Contributors starting March 2026. See LICENSE and NOTICE.
 */

import {APIErrorCodes, MAX_GUILD_CHANNELS} from '~/Constants';
import {BadRequestError} from './BadRequestError';

export class MaxGuildChannelsError extends BadRequestError {
	constructor() {
		super({
			code: APIErrorCodes.MAX_GUILD_CHANNELS,
			message: `Достигнуто максимальное количество каналов на сервере (${MAX_GUILD_CHANNELS}).`,
		});
	}
}
