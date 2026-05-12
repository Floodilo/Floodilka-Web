/*
 * SPDX-License-Identifier: AGPL-3.0-or-later
 * Copyright (C) 2020-2026 Fluxer Contributors
 * Copyright (C) 2026 Floodilka Contributors
 * Modified by Floodilka Contributors starting March 2026. See LICENSE and NOTICE.
 */

import {useLingui} from '@lingui/react/macro';
import React from 'react';
import type {FieldValues, Path, UseFormReturn} from 'react-hook-form';
import type {HttpResponse} from '~/lib/HttpClient';
import {isAbortError} from '~/stores/SudoPromptStore';
import * as FormUtils from '~/utils/FormUtils';

interface UseFormSubmitOptions<T extends FieldValues> {
	form: UseFormReturn<T>;
	onSubmit: (data: T) => Promise<void> | void;
	defaultErrorField: Path<T>;
}

export function useFormSubmit<T extends FieldValues>({form, onSubmit, defaultErrorField}: UseFormSubmitOptions<T>) {
	const {i18n} = useLingui();

	const handleSubmit = React.useCallback(
		async (data: T) => {
			try {
				await onSubmit(data);
			} catch (error) {
				if (isAbortError(error)) {
					return;
				}
				FormUtils.handleError(i18n, form, error as HttpResponse, defaultErrorField);
				return;
			}
		},
		[form, onSubmit, defaultErrorField, i18n],
	);

	const submitWithErrorClearing = React.useCallback(async () => {
		const errors = form.formState.errors;
		const errorFields = Object.keys(errors) as Array<Path<T>>;

		errorFields.forEach((field) => {
			const error = errors[field];
			if (error && 'type' in error && error.type === 'server') {
				form.clearErrors(field);
			}
		});

		await form.handleSubmit(handleSubmit)();
	}, [form, handleSubmit]);

	return {
		handleSubmit: submitWithErrorClearing,
		isSubmitting: form.formState.isSubmitting,
	};
}
