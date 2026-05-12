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
import {modal} from '~/actions/ModalActionCreators';
import * as ToastActionCreators from '~/actions/ToastActionCreators';
import {Form} from '~/components/form/Form';
import {BackupCodesModal} from '~/components/modals/BackupCodesModal';
import * as Modal from '~/components/modals/Modal';
import {Button} from '~/components/uikit/Button/Button';
import {useFormSubmit} from '~/hooks/useFormSubmit';

export const BackupCodesRegenerateModal = observer(() => {
	const {t} = useLingui();
	const form = useForm();

	const onSubmit = async () => {
		const backupCodes = await MfaActionCreators.getBackupCodes(true);
		ModalActionCreators.pop();
		ModalActionCreators.update('backup-codes', () => modal(() => <BackupCodesModal backupCodes={backupCodes} />));
		ToastActionCreators.createToast({
			type: 'success',
			children: t`Backup codes regenerated`,
		});
	};

	const {handleSubmit} = useFormSubmit({
		form,
		onSubmit,
		defaultErrorField: 'form',
	});

	return (
		<Modal.Root size="small" centered>
			<Form form={form} onSubmit={handleSubmit}>
				<Modal.Header title={t`Regenerate backup codes`} />
				<Modal.Content>This will invalidate your existing backup codes and generate new ones.</Modal.Content>
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
