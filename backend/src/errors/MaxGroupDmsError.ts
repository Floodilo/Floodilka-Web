/*
 * SPDX-License-Identifier: AGPL-3.0-or-later
 * Copyright (C) 2020-2026 Fluxer Contributors
 * Copyright (C) 2026 Floodilka Contributors
 * Modified by Floodilka Contributors starting March 2026. See LICENSE and NOTICE.
 */

import {APIErrorCodes, MAX_GROUP_DMS_PER_USER} from '~/Constants';
import {BadRequestError} from './BadRequestError';

export class MaxGroupDmsError extends BadRequestError {
	constructor() {
		super({
			code: APIErrorCodes.MAX_GROUP_DMS,
			message: `Вы можете состоять максимум в ${MAX_GROUP_DMS_PER_USER} групповых чатах.`,
			data: {
				max_group_dms: MAX_GROUP_DMS_PER_USER,
			},
		});
	}
}
