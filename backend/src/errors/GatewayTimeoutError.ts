/*
 * SPDX-License-Identifier: AGPL-3.0-or-later
 * Copyright (C) 2020-2026 Fluxer Contributors
 * Copyright (C) 2026 Floodilka Contributors
 * Modified by Floodilka Contributors starting March 2026. See LICENSE and NOTICE.
 */

import {APIErrorCodes} from '~/Constants';
import {FloodilkaAPIError} from './FloodilkaAPIError';

export class GatewayTimeoutError extends FloodilkaAPIError {
	constructor({code = APIErrorCodes.GATEWAY_TIMEOUT, message}: {code?: string; message?: string} = {}) {
		super({code, message: message ?? 'Таймаут шлюза', status: 504});
	}
}
