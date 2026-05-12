/*
 * SPDX-License-Identifier: AGPL-3.0-or-later
 * Copyright (C) 2020-2026 Fluxer Contributors
 * Copyright (C) 2026 Floodilka Contributors
 * Modified by Floodilka Contributors starting March 2026. See LICENSE and NOTICE.
 */

import {APIErrorCodes, MAX_USERS_PER_MESSAGE_REACTION} from '~/Constants';
import {BadRequestError} from './BadRequestError';

export class MaxUsersPerMessageReactionError extends BadRequestError {
	constructor() {
		super({
			code: APIErrorCodes.MAX_REACTIONS,
			message: `Достигнуто максимальное количество пользователей на одну реакцию (${MAX_USERS_PER_MESSAGE_REACTION}).`,
		});
	}
}
