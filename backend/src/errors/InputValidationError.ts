/*
 * SPDX-License-Identifier: AGPL-3.0-or-later
 * Copyright (C) 2020-2026 Fluxer Contributors
 * Copyright (C) 2026 Floodilka Contributors
 * Modified by Floodilka Contributors starting March 2026. See LICENSE and NOTICE.
 */

import {APIErrorCodes} from '~/Constants';
import {BadRequestError} from './BadRequestError';
import type {ValidationError} from './ValidationError';

export class InputValidationError extends BadRequestError {
	constructor(errors: Array<ValidationError>) {
		super({code: APIErrorCodes.INVALID_FORM_BODY, message: 'Ошибка валидации', data: {errors}});
	}

	static create(path: string, message: string): InputValidationError {
		return new InputValidationError([{path, message}]);
	}

	static createMultiple(errors: Array<{field: string; message: string}>): InputValidationError {
		return new InputValidationError(errors.map((e) => ({path: e.field, message: e.message})));
	}
}
