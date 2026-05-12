/*
 * SPDX-License-Identifier: AGPL-3.0-or-later
 * Copyright (C) 2020-2026 Fluxer Contributors
 * Copyright (C) 2026 Floodilka Contributors
 * Modified by Floodilka Contributors starting March 2026. See LICENSE and NOTICE.
 */

import {Trans, useLingui} from '@lingui/react/macro';
import {observer} from 'mobx-react-lite';
import {useForm} from 'react-hook-form';
import * as ModalActionCreators from '~/actions/ModalActionCreators';
import * as ToastActionCreators from '~/actions/ToastActionCreators';
import * as UserActionCreators from '~/actions/UserActionCreators';
import {Form} from '~/components/form/Form';
import {Input} from '~/components/form/Input';
import styles from '~/components/modals/ConfirmModal.module.css';
import * as Modal from '~/components/modals/Modal';
import {Button} from '~/components/uikit/Button/Button';
import {useFormSubmit} from '~/hooks/useFormSubmit';

interface FormInputs {
	new_password: string;
	confirm_password: string;
}

export const PasswordChangeModal = observer(() => {
	const {t} = useLingui();
	const form = useForm<FormInputs>();

	const onSubmit = async (data: FormInputs) => {
		if (data.new_password !== data.confirm_password) {
			form.setError('confirm_password', {message: t`Passwords do not match`});
			return;
		}

		await UserActionCreators.update({new_password: data.new_password});
		ModalActionCreators.pop();
		ToastActionCreators.createToast({type: 'success', children: <Trans>Password changed</Trans>});
	};

	const {handleSubmit, isSubmitting} = useFormSubmit({
		form,
		onSubmit,
		defaultErrorField: 'new_password',
	});

	return (
		<Modal.Root size="small" centered>
			<Form form={form} onSubmit={handleSubmit}>
				<Modal.Header title={t`Update your password`} />
				<Modal.Content className={styles.content}>
					<p className={styles.descriptionText}>
						<Trans>Enter your new password.</Trans>
					</p>

					<div className={styles.inputContainer}>
						<Input
							{...form.register('new_password')}
							autoFocus={true}
							autoComplete="new-password"
							error={form.formState.errors.new_password?.message}
							label={t`New password`}
							maxLength={128}
							minLength={8}
							placeholder={'•'.repeat(32)}
							required={true}
							type="password"
						/>
						<Input
							{...form.register('confirm_password')}
							autoComplete="new-password"
							error={form.formState.errors.confirm_password?.message}
							label={t`Confirm new password`}
							maxLength={128}
							minLength={8}
							placeholder={'•'.repeat(32)}
							required={true}
							type="password"
						/>
					</div>
				</Modal.Content>
				<Modal.Footer>
					<Button onClick={ModalActionCreators.pop} variant="secondary">
						<Trans>Cancel</Trans>
					</Button>
					<Button type="submit" submitting={isSubmitting}>
						<Trans>Continue</Trans>
					</Button>
				</Modal.Footer>
			</Form>
		</Modal.Root>
	);
});
