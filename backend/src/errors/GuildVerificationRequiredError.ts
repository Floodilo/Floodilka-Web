/*
 * SPDX-License-Identifier: AGPL-3.0-or-later
 * Copyright (C) 2020-2026 Fluxer Contributors
 * Copyright (C) 2026 Floodilka Contributors
 * Modified by Floodilka Contributors starting March 2026. See LICENSE and NOTICE.
 */

import {APIErrorCodes} from '~/Constants';
import {ForbiddenError} from './ForbiddenError';

export class GuildVerificationRequiredError extends ForbiddenError {
	constructor(message: string = 'Требуется верификация для входа на сервер') {
		super({code: APIErrorCodes.GUILD_VERIFICATION_REQUIRED, message});
	}
}
