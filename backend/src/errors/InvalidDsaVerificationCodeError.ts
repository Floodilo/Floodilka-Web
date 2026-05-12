/*
 * SPDX-License-Identifier: AGPL-3.0-or-later
 * Copyright (C) 2020-2026 Fluxer Contributors
 * Copyright (C) 2026 Floodilka Contributors
 * Modified by Floodilka Contributors starting March 2026. See LICENSE and NOTICE.
 */

import {APIErrorCodes} from '~/Constants';
import {BadRequestError} from './BadRequestError';

export class InvalidDsaVerificationCodeError extends BadRequestError {
	constructor() {
		super({
			code: APIErrorCodes.INVALID_DSA_VERIFICATION_CODE,
			message: 'Недействительный или просроченный код подтверждения. Запросите новое письмо.',
		});
	}
}
