/*
 * SPDX-License-Identifier: AGPL-3.0-or-later
 * Copyright (C) 2020-2026 Fluxer Contributors
 * Copyright (C) 2026 Floodilka Contributors
 * Modified by Floodilka Contributors starting March 2026. See LICENSE and NOTICE.
 */

import {APIErrorCodes} from '~/constants/API';
import {ForbiddenError} from './ForbiddenError';

export class CommunicationDisabledError extends ForbiddenError {
	constructor() {
		super({
			code: APIErrorCodes.COMMUNICATION_DISABLED,
			message: 'Общение отключено на время тайм-аута',
		});
	}
}
