/*
 * SPDX-License-Identifier: AGPL-3.0-or-later
 * Copyright (C) 2020-2026 Fluxer Contributors
 * Copyright (C) 2026 Floodilka Contributors
 * Modified by Floodilka Contributors starting March 2026. See LICENSE and NOTICE.
 */

import {Trans, useLingui} from '@lingui/react/macro';
import {observer} from 'mobx-react-lite';
import {useForm} from 'react-hook-form';
import * as MfaActionCreators from '~/actions/MfaActionCreators';
import * as ModalActionCreators from '~/actions/ModalActionCreators';
import * as ToastActionCreators from '~/actions/ToastActionCreators';
import {Form} from '~/components/form/Form';
import {Input} from '~/components/form/Input';
import confirmStyles from '~/components/modals/ConfirmModal.module.css';
import styles from '~/components/modals/MfaTotpDisableModal.module.css';
import * as Modal from '~/components/modals/Modal';
import {Button} from '~/components/uikit/Button/Button';
import {useFormSubmit} from '~/hooks/useFormSubmit';

interface FormInputs {
	code: string;
}

export const MfaTotpDisableModal = observer(() => {
	const {t} = useLingui();
	const form = useForm<FormInputs>();

	const onSubmit = async (data: FormInputs) => {
		await MfaActionCreators.disableMfaTotp(data.code.split(' ').join(''));
		ModalActionCreators.pop();
		ToastActionCreators.createToast({type: 'success', children: <Trans>Two-factor authentication disabled</Trans>});
	};

	const {handleSubmit} = useFormSubmit({
		form,
		onSubmit,
		defaultErrorField: 'code',
	});

	return (
		<Modal.Root size="small" centered>
			<Form form={form} onSubmit={handleSubmit} aria-label={t`Disable two-factor authentication form`}>
				<Modal.Header title={t`Remove authenticator app`} />
				<Modal.Content className={confirmStyles.content}>
					<Input
						{...form.register('code')}
						autoFocus={true}
						autoComplete="one-time-code"
						error={form.formState.errors.code?.message}
						label={t`Code`}
						required={true}
						footer={
							<p className={styles.footer}>
								<Trans>Enter the 6-digit code from your authenticator app.</Trans>
							</p>
						}
					/>
				</Modal.Content>
				<Modal.Footer>
					<Button onClick={ModalActionCreators.pop} variant="secondary">
						<Trans>Cancel</Trans>
					</Button>
					<Button type="submit" submitting={form.formState.isSubmitting}>
						<Trans>Continue</Trans>
					</Button>
				</Modal.Footer>
			</Form>
		</Modal.Root>
	);
});
