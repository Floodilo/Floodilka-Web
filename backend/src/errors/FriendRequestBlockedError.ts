/*
 * SPDX-License-Identifier: AGPL-3.0-or-later
 * Copyright (C) 2020-2026 Fluxer Contributors
 * Copyright (C) 2026 Floodilka Contributors
 * Modified by Floodilka Contributors starting March 2026. See LICENSE and NOTICE.
 */

import {APIErrorCodes} from '~/Constants';
import {BadRequestError} from './BadRequestError';

export class FriendRequestBlockedError extends BadRequestError {
	constructor() {
		super({
			code: APIErrorCodes.FRIEND_REQUEST_BLOCKED,
			message: 'Этот пользователь не принимает от вас запросы в друзья',
		});
	}
}
