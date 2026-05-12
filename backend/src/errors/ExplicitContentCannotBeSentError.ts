/*
 * SPDX-License-Identifier: AGPL-3.0-or-later
 * Copyright (C) 2020-2026 Fluxer Contributors
 * Copyright (C) 2026 Floodilka Contributors
 * Modified by Floodilka Contributors starting March 2026. See LICENSE and NOTICE.
 */

import {APIErrorCodes} from '~/Constants';
import {BadRequestError} from './BadRequestError';

export class ExplicitContentCannotBeSentError extends BadRequestError {
	constructor(probability: number, predictions: Record<string, number>) {
		super({
			code: APIErrorCodes.EXPLICIT_CONTENT_CANNOT_BE_SENT,
			message: `Откровенный контент не может быть отправлен в данном контексте (вероятность ${(probability * 100).toFixed(1)}%)`,
			data: {probability, predictions},
		});
	}
}
