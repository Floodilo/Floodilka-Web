/*
 * SPDX-License-Identifier: AGPL-3.0-or-later
 * Copyright (C) 2020-2026 Fluxer Contributors
 * Copyright (C) 2026 Floodilka Contributors
 * Modified by Floodilka Contributors starting March 2026. See LICENSE and NOTICE.
 */

import {APIErrorCodes} from '~/Constants';
import {BadRequestError} from './BadRequestError';

export class MaxPackExpressionsError extends BadRequestError {
	constructor(maxExpressions: number) {
		super({
			code: APIErrorCodes.MAX_PACK_EXPRESSIONS,
			message: `Пак может содержать не более ${maxExpressions} выражений`,
			data: {
				max_expressions: maxExpressions,
			},
		});
	}
}
