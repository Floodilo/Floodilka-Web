/*
 * SPDX-License-Identifier: AGPL-3.0-or-later
 * Copyright (C) 2020-2026 Fluxer Contributors
 * Copyright (C) 2026 Floodilka Contributors
 * Modified by Floodilka Contributors starting March 2026. See LICENSE and NOTICE.
 */

import {APIErrorCodes} from '~/Constants';
import {ForbiddenError} from './ForbiddenError';

export class PackAccessDeniedError extends ForbiddenError {
	constructor() {
		super({code: APIErrorCodes.PACK_ACCESS_DENIED, message: 'У вас нет прав для управления этим паком'});
	}
}
