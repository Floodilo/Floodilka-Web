/*
 * SPDX-License-Identifier: AGPL-3.0-or-later
 * Copyright (C) 2020-2026 Fluxer Contributors
 * Copyright (C) 2026 Floodilka Contributors
 * Modified by Floodilka Contributors starting March 2026. See LICENSE and NOTICE.
 */

import {APIErrorCodes} from '~/Constants';
import {BadRequestError} from './BadRequestError';

export class CannotSendMessagesToUserError extends BadRequestError {
	constructor() {
		super({code: APIErrorCodes.CANNOT_SEND_MESSAGES_TO_USER, message: 'Невозможно отправить сообщение этому пользователю'});
	}
}
