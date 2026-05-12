/*
 * SPDX-License-Identifier: AGPL-3.0-or-later
 * Copyright (C) 2020-2026 Fluxer Contributors
 * Copyright (C) 2026 Floodilka Contributors
 * Modified by Floodilka Contributors starting March 2026. See LICENSE and NOTICE.
 */

import {OAuth2Error} from './OAuth2Error';

export class InvalidRequestError extends OAuth2Error {
	constructor(message = 'В запросе отсутствует обязательный параметр или он имеет неверный формат') {
		super({error: 'invalid_request', errorDescription: message, status: 400});
	}
}
