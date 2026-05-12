/*
 * SPDX-License-Identifier: AGPL-3.0-or-later
 * Copyright (C) 2020-2026 Fluxer Contributors
 * Copyright (C) 2026 Floodilka Contributors
 * Modified by Floodilka Contributors starting March 2026. See LICENSE and NOTICE.
 */

import {APIErrorCodes} from '~/Constants';
import {FloodilkaAPIError, type FloodilkaErrorData} from './FloodilkaAPIError';

export class UnauthorizedError extends FloodilkaAPIError {
	constructor({
		message = 'Не авторизован',
		headers,
		data,
	}: {
		message?: string;
		data?: FloodilkaErrorData;
		headers?: Record<string, string>;
	} = {}) {
		super({code: APIErrorCodes.UNAUTHORIZED, message, status: 401, data, headers});
	}
}
