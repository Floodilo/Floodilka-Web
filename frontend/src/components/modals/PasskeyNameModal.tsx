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
import {Form} from '~/components/form/Form';
import {Input} from '~/components/form/Input';
import styles from '~/components/modals/ConfirmModal.module.css';
import * as Modal from '~/components/modals/Modal';
import {Button} from '~/components/uikit/Button/Button';

interface FormInputs {
	name: string;
}

export const PasskeyNameModal = observer(({onSubmit}: {onSubmit: (name: string) => void | Promise<void>}) => {
	const {t} = useLingui();
	const form = useForm<FormInputs>();

	const handleSubmit = async (data: FormInputs) => {
		await onSubmit(data.name);
		ModalActionCreators.pop();
	};

	return (
		<Modal.Root size="small" centered>
			<Form form={form} onSubmit={handleSubmit} aria-label={t`Name passkey form`}>
				<Modal.Header title={t`Name Passkey`} />
				<Modal.Content className={styles.content}>
					<Input
						{...form.register('name')}
						autoFocus={true}
						error={form.formState.errors.name?.message}
						label={t`Passkey Name`}
						maxLength={64}
						minLength={1}
						placeholder={t`e.g., YubiKey, iPhone, Work Computer`}
						required={true}
						type="text"
					/>
				</Modal.Content>
				<Modal.Footer>
					<Button onClick={ModalActionCreators.pop} variant="secondary">
						<Trans>Cancel</Trans>
					</Button>
					<Button type="submit" submitting={form.formState.isSubmitting}>
						<Trans>Save</Trans>
					</Button>
				</Modal.Footer>
			</Form>
		</Modal.Root>
	);
});
