/*
 * SPDX-License-Identifier: AGPL-3.0-or-later
 * Copyright (C) 2020-2026 Fluxer Contributors
 * Copyright (C) 2026 Floodilka Contributors
 * Modified by Floodilka Contributors starting March 2026. See LICENSE and NOTICE.
 */

import {OAuth2Error} from './OAuth2Error';

export class InvalidScopeError extends OAuth2Error {
	constructor(message = 'Запрошенная область доступа недействительна или не поддерживается') {
		super({error: 'invalid_scope', errorDescription: message, status: 400});
	}
}
