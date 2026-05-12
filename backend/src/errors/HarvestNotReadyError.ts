/*
 * SPDX-License-Identifier: AGPL-3.0-or-later
 * Copyright (C) 2020-2026 Fluxer Contributors
 * Copyright (C) 2026 Floodilka Contributors
 * Modified by Floodilka Contributors starting March 2026. See LICENSE and NOTICE.
 */

import {APIErrorCodes} from '~/constants/API';
import {BadRequestError} from './BadRequestError';

export class HarvestNotReadyError extends BadRequestError {
	constructor() {
		super({code: APIErrorCodes.HARVEST_NOT_READY, message: 'Сбор данных ещё не завершён'});
	}
}
