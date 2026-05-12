/*
 * SPDX-License-Identifier: AGPL-3.0-or-later
 * Copyright (C) 2020-2026 Fluxer Contributors
 * Copyright (C) 2026 Floodilka Contributors
 * Modified by Floodilka Contributors starting March 2026. See LICENSE and NOTICE.
 */

import {BadRequestError} from './BadRequestError';
import type {FloodilkaErrorData} from './FloodilkaAPIError';

export class BotAlreadyInGuildError extends BadRequestError {
	constructor({
		message = 'Бот уже добавлен на этот сервер',
		headers,
		data,
	}: {
		message?: string;
		data?: FloodilkaErrorData;
		headers?: Record<string, string>;
	} = {}) {
		super({code: 'BOT_ALREADY_IN_GUILD', message, data, headers});
	}
}
