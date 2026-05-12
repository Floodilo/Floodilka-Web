/*
 * SPDX-License-Identifier: AGPL-3.0-or-later
 * Copyright (C) 2020-2026 Fluxer Contributors
 * Copyright (C) 2026 Floodilka Contributors
 * Modified by Floodilka Contributors starting March 2026. See LICENSE and NOTICE.
 */

import {useLingui} from '@lingui/react/macro';
import {observer} from 'mobx-react-lite';
import {useForm} from 'react-hook-form';
import * as ChannelActionCreators from '~/actions/ChannelActionCreators';
import * as ModalActionCreators from '~/actions/ModalActionCreators';
import {ChannelTypes} from '~/Constants';
import {Form} from '~/components/form/Form';
import {Input} from '~/components/form/Input';
import styles from '~/components/modals/ConfirmModal.module.css';
import * as Modal from '~/components/modals/Modal';
import {Button} from '~/components/uikit/Button/Button';
import {useFormSubmit} from '~/hooks/useFormSubmit';

interface FormInputs {
	name: string;
}

export const CategoryCreateModal = observer(({guildId}: {guildId: string}) => {
	const {t} = useLingui();
	const form = useForm<FormInputs>();

	const onSubmit = async (data: FormInputs) => {
		await ChannelActionCreators.create(guildId, {
			name: data.name,
			type: ChannelTypes.GUILD_CATEGORY,
			parent_id: null,
			bitrate: null,
			user_limit: null,
		});

		ModalActionCreators.pop();
	};

	const {handleSubmit} = useFormSubmit({
		form,
		onSubmit,
		defaultErrorField: 'name',
	});

	return (
		<Modal.Root size="small" centered>
			<Form form={form} onSubmit={handleSubmit}>
				<Modal.Header title={t`Create Category`} />
				<Modal.Content className={styles.content}>
					<Input
						{...form.register('name')}
						autoFocus={true}
						autoComplete="off"
						error={form.formState.errors.name?.message}
						label={t`Name`}
						maxLength={100}
						minLength={1}
						placeholder={t`New Category`}
						required={true}
					/>
				</Modal.Content>
				<Modal.Footer>
					<Button onClick={ModalActionCreators.pop} variant="secondary">
						{t`Cancel`}
					</Button>
					<Button type="submit" submitting={form.formState.isSubmitting}>
						{t`Create Category`}
					</Button>
				</Modal.Footer>
			</Form>
		</Modal.Root>
	);
});
