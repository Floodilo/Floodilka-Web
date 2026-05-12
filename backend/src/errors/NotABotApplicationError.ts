/*
 * SPDX-License-Identifier: AGPL-3.0-or-later
 * Copyright (C) 2020-2026 Fluxer Contributors
 * Copyright (C) 2026 Floodilka Contributors
 * Modified by Floodilka Contributors starting March 2026. See LICENSE and NOTICE.
 */

import {BadRequestError} from './BadRequestError';
import type {FloodilkaErrorData} from './FloodilkaAPIError';

export class NotABotApplicationError extends BadRequestError {
	constructor({
		message = 'Приложение не является ботом',
		headers,
		data,
	}: {
		message?: string;
		data?: FloodilkaErrorData;
		headers?: Record<string, string>;
	} = {}) {
		super({code: 'NOT_A_BOT_APPLICATION', message, data, headers});
	}
}
