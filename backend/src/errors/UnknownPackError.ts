/*
 * SPDX-License-Identifier: AGPL-3.0-or-later
 * Copyright (C) 2020-2026 Fluxer Contributors
 * Copyright (C) 2026 Floodilka Contributors
 * Modified by Floodilka Contributors starting March 2026. See LICENSE and NOTICE.
 */

import {APIErrorCodes} from '~/Constants';
import {NotFoundError} from './NotFoundError';

export class UnknownPackError extends NotFoundError {
	constructor() {
		super({code: APIErrorCodes.UNKNOWN_PACK, message: 'Пак не найден'});
	}
}
