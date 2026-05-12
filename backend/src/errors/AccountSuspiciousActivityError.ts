/*
 * SPDX-License-Identifier: AGPL-3.0-or-later
 * Copyright (C) 2020-2026 Fluxer Contributors
 * Copyright (C) 2026 Floodilka Contributors
 * Modified by Floodilka Contributors starting March 2026. See LICENSE and NOTICE.
 */

import {APIErrorCodes} from '~/Constants';
import {ForbiddenError} from './ForbiddenError';

export class AccountSuspiciousActivityError extends ForbiddenError {
	constructor(suspiciousActivityFlags: number) {
		super({
			code: APIErrorCodes.ACCOUNT_SUSPICIOUS_ACTIVITY,
			message: 'Ваш аккаунт отмечен за подозрительную активность. Пожалуйста, подтвердите свою личность для продолжения.',
			data: {
				data: {
					suspicious_activity_flags: suspiciousActivityFlags,
				},
			},
		});
	}
}
