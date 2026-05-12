/*
 * SPDX-License-Identifier: AGPL-3.0-or-later
 * Copyright (C) 2020-2026 Fluxer Contributors
 * Copyright (C) 2026 Floodilka Contributors
 * Modified by Floodilka Contributors starting March 2026. See LICENSE and NOTICE.
 */

import {Trans, useLingui} from '@lingui/react/macro';
import {observer} from 'mobx-react-lite';
import {useForm} from 'react-hook-form';
import * as GuildActionCreators from '~/actions/GuildActionCreators';
import * as ModalActionCreators from '~/actions/ModalActionCreators';
import * as ToastActionCreators from '~/actions/ToastActionCreators';
import {Form} from '~/components/form/Form';
import * as Modal from '~/components/modals/Modal';
import {Button} from '~/components/uikit/Button/Button';
import {useFormSubmit} from '~/hooks/useFormSubmit';

export const GuildDeleteModal = observer(({guildId}: {guildId: string}) => {
	const {t} = useLingui();
	const form = useForm();

	const onSubmit = async () => {
		await GuildActionCreators.remove(guildId);
		ModalActionCreators.popAll();
		ToastActionCreators.createToast({type: 'success', children: t`Community deleted`});
	};

	const {handleSubmit} = useFormSubmit({
		form,
		onSubmit,
		defaultErrorField: 'form',
	});

	return (
		<Modal.Root size="small" centered>
			<Form form={form} onSubmit={handleSubmit} aria-label={t`Delete community form`}>
				<Modal.Header title={t`Delete Community`} />
				<Modal.Content>
					<Trans>
						Are you sure you want to delete this community? This action cannot be undone. All channels, messages, and
						settings will be permanently deleted.
					</Trans>
				</Modal.Content>
				<Modal.Footer>
					<Button onClick={ModalActionCreators.pop} variant="secondary">
						<Trans>I changed my mind</Trans>
					</Button>
					<Button type="submit" submitting={form.formState.isSubmitting} variant="danger-primary">
						<Trans>Delete Community</Trans>
					</Button>
				</Modal.Footer>
			</Form>
		</Modal.Root>
	);
});
