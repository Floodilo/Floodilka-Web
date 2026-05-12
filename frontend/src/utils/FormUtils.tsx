/*
 * SPDX-License-Identifier: AGPL-3.0-or-later
 * Copyright (C) 2020-2026 Fluxer Contributors
 * Copyright (C) 2026 Floodilka Contributors
 * Modified by Floodilka Contributors starting March 2026. See LICENSE and NOTICE.
 */

import type {I18n} from '@lingui/core';
import {msg} from '@lingui/core/macro';
import type {FieldValues, Path, UseFormReturn} from 'react-hook-form';
import {APIErrorCodes} from '~/Constants';
import type {HttpError, HttpResponse} from '~/lib/HttpClient';

interface ValidationError {
	path: string;
	message: string;
}

interface APIErrorResponse {
	code: string;
	message: string;
	errors?: Array<ValidationError>;
}

export const handleError = <T extends FieldValues>(
	i18n: I18n,
	form: UseFormReturn<T>,
	error: HttpResponse<unknown> | HttpError,
	defaultPath: Path<T>,
) => {
	if ('body' in error && error.body) {
		const errorData = error.body as APIErrorResponse;

		if (errorData.code === APIErrorCodes.INVALID_FORM_BODY && errorData.errors?.length) {
			const formFields = Object.keys(form.getValues()) as Array<Path<T>>;

			for (const validationError of errorData.errors) {
				const path = validationError.path as Path<T>;
				const message = validationError.message;

				if (formFields.includes(path)) {
					form.setError(path, {type: 'server', message});
				} else {
					form.setError(defaultPath, {type: 'server', message});
				}
			}
		} else if (errorData.message) {
			form.setError(defaultPath, {type: 'server', message: errorData.message});
		}
		return;
	}

	form.setError(defaultPath, {
		type: 'server',
		message: i18n._(msg`An unexpected error occurred. Please try again.`),
	});
};
