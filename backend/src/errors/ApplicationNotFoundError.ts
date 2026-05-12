/*
 * SPDX-License-Identifier: AGPL-3.0-or-later
 * Copyright (C) 2020-2026 Fluxer Contributors
 * Copyright (C) 2026 Floodilka Contributors
 * Modified by Floodilka Contributors starting March 2026. See LICENSE and NOTICE.
 */

import type {FloodilkaErrorData} from './FloodilkaAPIError';
import {NotFoundError} from './NotFoundError';

export class ApplicationNotFoundError extends NotFoundError {
	constructor({
		message = 'Приложение не найдено',
		headers,
		data,
	}: {
		message?: string;
		data?: FloodilkaErrorData;
		headers?: Record<string, string>;
	} = {}) {
		super({code: 'APPLICATION_NOT_FOUND', message, data, headers});
	}
}
