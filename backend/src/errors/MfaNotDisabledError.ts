/*
 * SPDX-License-Identifier: AGPL-3.0-or-later
 * Copyright (C) 2020-2026 Fluxer Contributors
 * Copyright (C) 2026 Floodilka Contributors
 * Modified by Floodilka Contributors starting March 2026. See LICENSE and NOTICE.
 */

import {APIErrorCodes} from '~/Constants';
import {BadRequestError} from './BadRequestError';

export class MfaNotDisabledError extends BadRequestError {
	constructor() {
		super({code: APIErrorCodes.TWO_FA_NOT_ENABLED, message: 'Для выполнения этого действия необходимо отключить двухфакторную аутентификацию.'});
	}
}
