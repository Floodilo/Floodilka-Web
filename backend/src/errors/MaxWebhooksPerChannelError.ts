/*
 * SPDX-License-Identifier: AGPL-3.0-or-later
 * Copyright (C) 2020-2026 Fluxer Contributors
 * Copyright (C) 2026 Floodilka Contributors
 * Modified by Floodilka Contributors starting March 2026. See LICENSE and NOTICE.
 */

import {APIErrorCodes, MAX_WEBHOOKS_PER_CHANNEL} from '~/Constants';
import {BadRequestError} from './BadRequestError';

export class MaxWebhooksPerChannelError extends BadRequestError {
	constructor() {
		super({
			code: APIErrorCodes.MAX_WEBHOOKS,
			message: `Достигнуто максимальное количество вебхуков на канал (${MAX_WEBHOOKS_PER_CHANNEL}).`,
		});
	}
}
