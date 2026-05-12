/*
 * SPDX-License-Identifier: AGPL-3.0-or-later
 * Copyright (C) 2020-2026 Fluxer Contributors
 * Copyright (C) 2026 Floodilka Contributors
 * Modified by Floodilka Contributors starting March 2026. See LICENSE and NOTICE.
 */

import {APIErrorCodes, MAX_GROUP_DM_RECIPIENTS} from '~/Constants';
import {BadRequestError} from './BadRequestError';

export class MaxGroupDmRecipientsError extends BadRequestError {
	constructor() {
		super({
			code: APIErrorCodes.MAX_GROUP_DM_RECIPIENTS,
			message: `Максимальное количество участников группового чата — ${MAX_GROUP_DM_RECIPIENTS}.`,
			data: {
				max_recipients: MAX_GROUP_DM_RECIPIENTS,
			},
		});
	}
}
