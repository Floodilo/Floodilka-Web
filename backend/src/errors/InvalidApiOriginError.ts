/*
 * SPDX-License-Identifier: AGPL-3.0-or-later
 * Copyright (C) 2020-2026 Fluxer Contributors
 * Copyright (C) 2026 Floodilka Contributors
 * Modified by Floodilka Contributors starting March 2026. See LICENSE and NOTICE.
 */

import {FloodilkaAPIError} from './FloodilkaAPIError';

export class InvalidApiOriginError extends FloodilkaAPIError {
	constructor() {
		super({
			code: 'INVALID_API_ORIGIN',
			message: 'Этот эндпоинт недоступен с данного источника. Используйте правильный API-эндпоинт.',
			status: 403,
		});
	}
}
