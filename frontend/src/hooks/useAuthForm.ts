/*
 * SPDX-License-Identifier: AGPL-3.0-or-later
 * Copyright (C) 2020-2026 Fluxer Contributors
 * Copyright (C) 2026 Floodilka Contributors
 * Modified by Floodilka Contributors starting March 2026. See LICENSE and NOTICE.
 */

import {useLingui} from '@lingui/react/macro';
import {useEffect, useState} from 'react';
import {APIErrorCodes} from '~/Constants';
import {HttpError, type HttpResponse} from '~/lib/HttpClient';
import * as RouterUtils from '~/utils/RouterUtils';
import {CaptchaCancelledError, CaptchaValidationError} from './useCaptcha';
import {useForm} from './useForm';

interface UseAuthFormOptions {
	initialValues: Record<string, string>;
	onSubmit: (values: Record<string, string>) => Promise<void>;
	redirectPath?: string;
	firstFieldName?: string;
}

interface ValidationError {
	path: string;
	message: string;
}

interface APIErrorResponse {
	code: string;
	message: string;
	errors?: Array<ValidationError>;
}

type LinguiT = (literals: TemplateStringsArray, ...placeholders: Array<unknown>) => string;

const isHttpResponse = (value: unknown): value is HttpResponse<unknown> =>
	typeof value === 'object' && value !== null && 'ok' in value && 'status' in value && 'body' in value;

const getErrorData = (error: unknown): APIErrorResponse | undefined => {
	if (error instanceof HttpError) {
		return error.body as APIErrorResponse | undefined;
	}
	if (isHttpResponse(error)) {
		return error.body as APIErrorResponse | undefined;
	}
	if (typeof error === 'object' && error !== null && 'body' in error) {
		return (error as {body?: APIErrorResponse}).body;
	}
	return undefined;
};

export function useAuthForm({initialValues, onSubmit, redirectPath, firstFieldName}: UseAuthFormOptions) {
	const {t} = useLingui();

	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const [fieldErrors, setFieldErrors] = useState<Record<string, string> | null>(null);

	const form = useForm({
		initialValues,
		onSubmit: async (values) => {
			setIsLoading(true);
			setError(null);
			setFieldErrors(null);

			try {
				await onSubmit(values);
				if (redirectPath) {
					RouterUtils.replaceWith(redirectPath);
				}
			} catch (err) {
				if (err instanceof CaptchaCancelledError) {
					return;
				}
				if (err instanceof CaptchaValidationError) {
					return;
				}
				extractErrors(err, setError, setFieldErrors, form, t, firstFieldName);
			} finally {
				setIsLoading(false);
			}
		},
	});

	useEffect(() => {
		setError(null);
		setFieldErrors(null);
	}, []);

	return {
		form,
		isLoading,
		error,
		fieldErrors,
	};
}

export const getAuthErrorMessage = (error: unknown, t?: LinguiT): string => {
	const errorData = getErrorData(error);
	const unexpected = t ? t`An unexpected error occurred` : 'An unexpected error occurred';
	const fallbackMessage = error instanceof Error ? error.message : unexpected;
	return errorData?.message || fallbackMessage;
};

const extractErrors = (
	error: unknown,
	setError: (error: string | null) => void,
	setFieldErrors: (errors: Record<string, string> | null) => void,
	form: ReturnType<typeof useForm>,
	t: LinguiT,
	firstFieldName?: string,
) => {
	const errorData = getErrorData(error);

	if (errorData?.code === APIErrorCodes.INVALID_FORM_BODY && errorData.errors?.length) {
		const fieldErrors = errorData.errors.reduce(
			(acc, {path, message}) => {
				acc[path] = message;
				return acc;
			},
			{} as Record<string, string>,
		);

		setFieldErrors(fieldErrors);
		form.setErrors(fieldErrors);
		return;
	}

	const message = getAuthErrorMessage(error, t);

	if (firstFieldName) {
		const fieldErrors = {[firstFieldName]: message};
		setFieldErrors(fieldErrors);
		form.setErrors(fieldErrors);
	} else {
		setError(message);
	}
};
