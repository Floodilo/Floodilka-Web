/*
 * SPDX-License-Identifier: AGPL-3.0-or-later
 * Copyright (C) 2020-2026 Fluxer Contributors
 * Copyright (C) 2026 Floodilka Contributors
 * Modified by Floodilka Contributors starting March 2026. See LICENSE and NOTICE.
 */

import {APIErrorCodes} from '~/constants/API';
import {FloodilkaAPIError} from './FloodilkaAPIError';

export class HarvestOnCooldownError extends FloodilkaAPIError {
	constructor({retryAfter}: {retryAfter: Date}) {
		const retryAfterSeconds = Math.ceil((retryAfter.getTime() - Date.now()) / 1000);
		super({
			code: APIErrorCodes.HARVEST_ON_COOLDOWN,
			message: 'Запрашивать архив данных можно только раз в 7 дней.',
			status: 429,
			data: {
				retry_after: retryAfterSeconds,
			},
			headers: {
				'Retry-After': retryAfterSeconds.toString(),
			},
		});
	}
}
