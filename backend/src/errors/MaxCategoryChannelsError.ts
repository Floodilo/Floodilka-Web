/*
 * SPDX-License-Identifier: AGPL-3.0-or-later
 * Copyright (C) 2020-2026 Fluxer Contributors
 * Copyright (C) 2026 Floodilka Contributors
 * Modified by Floodilka Contributors starting March 2026. See LICENSE and NOTICE.
 */

import {APIErrorCodes, MAX_CHANNELS_PER_CATEGORY} from '~/Constants';
import {BadRequestError} from './BadRequestError';

export class MaxCategoryChannelsError extends BadRequestError {
	constructor() {
		super({
			code: APIErrorCodes.MAX_CATEGORY_CHANNELS,
			message: `Достигнуто максимальное количество каналов в категории (${MAX_CHANNELS_PER_CATEGORY}).`,
		});
	}
}
