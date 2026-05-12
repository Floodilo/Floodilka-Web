/*
 * SPDX-License-Identifier: AGPL-3.0-or-later
 * Copyright (C) 2020-2026 Fluxer Contributors
 * Copyright (C) 2026 Floodilka Contributors
 * Modified by Floodilka Contributors starting March 2026. See LICENSE and NOTICE.
 */

import {Trans, useLingui} from '@lingui/react/macro';
import {observer} from 'mobx-react-lite';
import {useForm} from 'react-hook-form';
import * as AuthSessionActionCreators from '~/actions/AuthSessionActionCreators';
import * as ModalActionCreators from '~/actions/ModalActionCreators';
import * as ToastActionCreators from '~/actions/ToastActionCreators';
import {Form} from '~/components/form/Form';
import * as Modal from '~/components/modals/Modal';
import {Button} from '~/components/uikit/Button/Button';
import {useFormSubmit} from '~/hooks/useFormSubmit';

export const DeviceRevokeModal = observer(({sessionIdHashes}: {sessionIdHashes: Array<string>}) => {
	const {t} = useLingui();
	const form = useForm();
	const sessionCount = sessionIdHashes.length;

	const title =
		sessionCount === 0
			? t`Log out all other devices`
			: sessionCount === 1
				? t`Log out 1 device`
				: t`Log out ${sessionCount} devices`;

	const onSubmit = async () => {
		await AuthSessionActionCreators.logout(sessionIdHashes);
		ModalActionCreators.pop();
		ToastActionCreators.createToast({type: 'success', children: t`Device revoked`});
	};

	const {handleSubmit} = useFormSubmit({
		form,
		onSubmit,
		defaultErrorField: 'form',
	});

	return (
		<Modal.Root size="small" centered>
			<Form form={form} onSubmit={handleSubmit}>
				<Modal.Header title={title} />
				<Modal.Content>
					This will log out the selected {sessionCount === 1 ? t`device` : t`devices`} from your account. You will need
					to log in again on those {sessionCount === 1 ? t`device` : t`devices`}.
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
