/*
 * SPDX-License-Identifier: AGPL-3.0-or-later
 * Copyright (C) 2020-2026 Fluxer Contributors
 * Copyright (C) 2026 Floodilka Contributors
 * Modified by Floodilka Contributors starting March 2026. See LICENSE and NOTICE.
 */

import {Trans, useLingui} from '@lingui/react/macro';
import {observer} from 'mobx-react-lite';
import {useEffect, useId} from 'react';
import * as AuthenticationActionCreators from '~/actions/AuthenticationActionCreators';
import {AuthRouterLink} from '~/components/auth/AuthRouterLink';
import FormField from '~/components/auth/FormField';
import {Button} from '~/components/uikit/Button/Button';
import {useAuthForm} from '~/hooks/useAuthForm';
import {useDocumentTitle} from '~/hooks/useDocumentTitle';
import {useHashParam} from '~/hooks/useHashParam';
import * as RouterUtils from '~/utils/RouterUtils';
import styles from './ResetPasswordPage.module.css';

const EmailRevertPage = observer(function EmailRevertPage() {
	const {t} = useLingui();
	const passwordId = useId();
	const confirmPasswordId = useId();

	useDocumentTitle(t`Secure your account`);

	const token = useHashParam('token');

	const {form, isLoading, fieldErrors} = useAuthForm({
		initialValues: {
			password: '',
			confirmPassword: '',
		},
		onSubmit: async (values) => {
			if (!token) {
				form.setError('password', 'Invalid or missing revert token');
				return;
			}

			if (values.password !== values.confirmPassword) {
				form.setError('confirmPassword', 'Passwords do not match');
				return;
			}

			const response = await AuthenticationActionCreators.revertEmailChange(token, values.password);
			await AuthenticationActionCreators.completeLogin({
				token: response.token,
				userId: response.user_id,
			});
		},
		firstFieldName: 'password',
	});

	useEffect(() => {
		if (!token) {
			RouterUtils.replaceWith('/login');
		}
	}, [token]);

	return (
		<>
			<h1 className={styles.title}>
				<Trans>Secure your account</Trans>
			</h1>

			<p className={styles.description}>
				<Trans>
					We'll restore your previous email, sign out old sessions, remove phone numbers, disable MFA, and secure your
					account with a new password.
				</Trans>
			</p>

			<form className={styles.form} onSubmit={form.handleSubmit}>
				<FormField
					id={passwordId}
					name="password"
					type="password"
					autoComplete="new-password"
					required
					label={t`New password`}
					value={form.getValue('password')}
					onChange={(value) => form.setValue('password', value)}
					error={form.getError('password') || fieldErrors?.password}
				/>

				<FormField
					id={confirmPasswordId}
					name="confirmPassword"
					type="password"
					autoComplete="new-password"
					required
					label={t`Confirm new password`}
					value={form.getValue('confirmPassword')}
					onChange={(value) => form.setValue('confirmPassword', value)}
					error={form.getError('confirmPassword')}
				/>

				<Button type="submit" fitContainer disabled={isLoading || form.isSubmitting}>
					<Trans>Restore account</Trans>
				</Button>
			</form>

			<div className={styles.footer}>
				<AuthRouterLink to="/login" className={styles.link}>
					<Trans>Back to login</Trans>
				</AuthRouterLink>
			</div>
		</>
	);
});

export default EmailRevertPage;
