/*
 * SPDX-License-Identifier: AGPL-3.0-or-later
 * Copyright (C) 2020-2026 Fluxer Contributors
 * Copyright (C) 2026 Floodilka Contributors
 * Modified by Floodilka Contributors starting March 2026. See LICENSE and NOTICE.
 */

import {OAuth2Error} from './OAuth2Error';

export class InvalidGrantError extends OAuth2Error {
	constructor(message = 'Предоставленное разрешение на авторизацию недействительно, истекло или отозвано') {
		super({error: 'invalid_grant', errorDescription: message, status: 400});
	}
}
