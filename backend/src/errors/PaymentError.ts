/*
 * SPDX-License-Identifier: AGPL-3.0-or-later
 * Copyright (C) 2020-2026 Fluxer Contributors
 * Copyright (C) 2026 Floodilka Contributors
 * Modified by Floodilka Contributors starting March 2026. See LICENSE and NOTICE.
 */

import {APIErrorCodes} from '~/Constants';
import {FloodilkaAPIError} from './FloodilkaAPIError';

export class PaymentError extends FloodilkaAPIError {
	constructor(message: string = 'Произошла ошибка обработки платежа') {
		super({
			code: APIErrorCodes.PAYMENT_ERROR,
			message,
			status: 400,
		});
	}
}
