/*
 * SPDX-License-Identifier: AGPL-3.0-or-later
 * Copyright (C) 2020-2026 Fluxer Contributors
 * Copyright (C) 2026 Floodilka Contributors
 * Modified by Floodilka Contributors starting March 2026. See LICENSE and NOTICE.
 */

import {APIErrorCodes} from '~/Constants';
import {BadRequestError} from './BadRequestError';

export class SlowmodeRateLimitError extends BadRequestError {
	constructor({
		message = 'Вы отправляете сообщения слишком быстро. Подождите немного.',
		retryAfter,
		retryAfterDecimal,
	}: {
		message?: string;
		retryAfter: number;
		retryAfterDecimal?: number;
	}) {
		super({
			code: APIErrorCodes.SLOWMODE_RATE_LIMITED,
			message,
			data: {
				retry_after: retryAfterDecimal ?? retryAfter,
			},
			headers: {
				'Retry-After': retryAfter.toString(),
			},
		});
	}
}
