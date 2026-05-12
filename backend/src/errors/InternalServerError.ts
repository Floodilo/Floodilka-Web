/*
 * SPDX-License-Identifier: AGPL-3.0-or-later
 * Copyright (C) 2020-2026 Fluxer Contributors
 * Copyright (C) 2026 Floodilka Contributors
 * Modified by Floodilka Contributors starting March 2026. See LICENSE and NOTICE.
 */

import {FloodilkaAPIError, type FloodilkaErrorData} from './FloodilkaAPIError';

export class InternalServerError extends FloodilkaAPIError {
	constructor({
		code,
		message = 'Внутренняя ошибка сервера',
		headers,
		data,
	}: {
		code: string;
		message?: string;
		data?: FloodilkaErrorData;
		headers?: Record<string, string>;
	}) {
		super({code, message, status: 500, data, headers});
	}
}
