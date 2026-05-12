/*
 * SPDX-License-Identifier: AGPL-3.0-or-later
 * Copyright (C) 2020-2026 Fluxer Contributors
 * Copyright (C) 2026 Floodilka Contributors
 * Modified by Floodilka Contributors starting March 2026. See LICENSE and NOTICE.
 */

import {APIErrorCodes} from '~/Constants';
import {FloodilkaAPIError} from './FloodilkaAPIError';

export class RateLimitError extends FloodilkaAPIError {
	constructor({
		message = 'Слишком много запросов. Подождите.',
		global = false,
		retryAfter,
		retryAfterDecimal,
		limit,
		resetTime,
	}: {
		message?: string;
		global?: boolean;
		retryAfter: number;
		retryAfterDecimal?: number;
		limit: number;
		resetTime: Date;
	}) {
		super({
			code: APIErrorCodes.RATE_LIMITED,
			message,
			status: 429,
			data: {
				global,
				retry_after: retryAfterDecimal ?? retryAfter,
			},
			headers: {
				'X-RateLimit-Global': global ? 'true' : 'false',
				'X-RateLimit-Limit': limit.toString(),
				'X-RateLimit-Remaining': '0',
				'X-RateLimit-Reset': Math.floor(resetTime.getTime() / 1000).toString(),
				'Retry-After': retryAfter.toString(),
			},
		});
	}
}
