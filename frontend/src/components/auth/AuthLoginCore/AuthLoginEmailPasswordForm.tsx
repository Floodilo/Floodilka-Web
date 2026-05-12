/*
 * SPDX-License-Identifier: AGPL-3.0-or-later
 * Copyright (C) 2020-2026 Fluxer Contributors
 * Copyright (C) 2026 Floodilka Contributors
 * Modified by Floodilka Contributors starting March 2026. See LICENSE and NOTICE.
 */

import {Trans, useLingui} from '@lingui/react/macro';
import type React from 'react';
import {useId} from 'react';
import FormField from '~/components/auth/FormField';
import {Button} from '~/components/uikit/Button/Button';

type FieldErrors = Record<string, string | undefined> | null | undefined;

export type AuthFormControllerLike = {
	handleSubmit: (event: React.FormEvent<HTMLFormElement>) => void;
	getValue: (name: string) => string;
	setValue: (name: string, value: string) => void;
	getError: (name: string) => string | null | undefined;
	isSubmitting?: boolean;
};

export type AuthEmailPasswordFormClasses = {
	form: string;
};

type Props = {
	form: AuthFormControllerLike;
	isLoading: boolean;
	fieldErrors?: FieldErrors;
	submitLabel: React.ReactNode;
	classes: AuthEmailPasswordFormClasses;
	extraFields?: React.ReactNode;
	links?: React.ReactNode;
	linksWrapperClassName?: string;
	disableSubmit?: boolean;
};

export default function AuthLoginEmailPasswordForm({
	form,
	isLoading,
	fieldErrors,
	submitLabel,
	classes,
	extraFields,
	links,
	linksWrapperClassName,
	disableSubmit,
}: Props) {
	const {t} = useLingui();
	const emailId = useId();
	const passwordId = useId();

	const isSubmitting = Boolean(form.isSubmitting);
	const submitDisabled = isLoading || isSubmitting || Boolean(disableSubmit);

	return (
		<form className={classes.form} onSubmit={form.handleSubmit}>
			<FormField
				id={emailId}
				name="email"
				type="email"
				autoComplete="email"
				required
				label={t`Email`}
				value={form.getValue('email')}
				onChange={(value) => form.setValue('email', value)}
				error={form.getError('email') || fieldErrors?.email}
			/>

			<FormField
				id={passwordId}
				name="password"
				type="password"
				autoComplete="current-password"
				required
				label={t`Password`}
				value={form.getValue('password')}
				onChange={(value) => form.setValue('password', value)}
				error={form.getError('password') || fieldErrors?.password}
			/>

			{extraFields}

			{links ? <div className={linksWrapperClassName}>{links}</div> : null}

			<Button type="submit" fitContainer disabled={submitDisabled}>
				{typeof submitLabel === 'string' ? <Trans>{submitLabel}</Trans> : submitLabel}
			</Button>
		</form>
	);
}
