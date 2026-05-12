/*
 * SPDX-License-Identifier: AGPL-3.0-or-later
 * Copyright (C) 2020-2026 Fluxer Contributors
 * Copyright (C) 2026 Floodilka Contributors
 * Modified by Floodilka Contributors starting March 2026. See LICENSE and NOTICE.
 */

import {APIErrorCodes, MAX_WEBHOOKS_PER_GUILD} from '~/Constants';
import {BadRequestError} from './BadRequestError';

export class MaxWebhooksPerGuildError extends BadRequestError {
	constructor() {
		super({
			code: APIErrorCodes.MAX_WEBHOOKS_PER_GUILD,
			message: `Достигнуто максимальное количество вебхуков на сервере (${MAX_WEBHOOKS_PER_GUILD}).`,
		});
	}
}
