/*
 * SPDX-License-Identifier: AGPL-3.0-or-later
 * Copyright (C) 2020-2026 Fluxer Contributors
 * Copyright (C) 2026 Floodilka Contributors
 * Modified by Floodilka Contributors starting March 2026. See LICENSE and NOTICE.
 */

import {useLingui} from '@lingui/react/macro';
import {observer} from 'mobx-react-lite';
import {Controller, useForm} from 'react-hook-form';
import * as ModalActionCreators from '~/actions/ModalActionCreators';
import {Form} from '~/components/form/Form';
import {Input} from '~/components/form/Input';
import styles from '~/components/modals/ChannelCreateModal.module.css';
import * as Modal from '~/components/modals/Modal';
import {Button} from '~/components/uikit/Button/Button';
import {RadioGroup} from '~/components/uikit/RadioGroup/RadioGroup';
import {useFormSubmit} from '~/hooks/useFormSubmit';
import {
	getChannelTypeOptions,
	createChannel,
	type FormInputs,
	getDefaultValues,
} from '~/utils/modals/ChannelCreateModalUtils';

export const ChannelCreateModal = observer(({guildId, parentId}: {guildId: string; parentId?: string}) => {
	const {t} = useLingui();
	const form = useForm<FormInputs>({
		defaultValues: getDefaultValues(),
	});

	const onSubmit = async (data: FormInputs) => {
		await createChannel(guildId, data, parentId);
	};

	const {handleSubmit} = useFormSubmit({
		form,
		onSubmit,
		defaultErrorField: 'name',
	});

	return (
		<Modal.Root size="small" centered>
			<Form form={form} onSubmit={handleSubmit}>
				<Modal.Header title={t`Create Channel`} />
				<Modal.Content className={styles.content}>
					<div className={styles.channelTypeSection}>
						<div className={styles.channelTypeLabel}>{t`Channel Type`}</div>
						<Controller
							name="type"
							control={form.control}
							render={({field}) => (
								<RadioGroup
									aria-label={t`Channel type selection`}
									value={Number(field.value)}
									onChange={(value) => field.onChange(value.toString())}
									options={getChannelTypeOptions(t)}
								/>
							)}
						/>
					</div>
					<Input
						{...form.register('name')}
						autoFocus={true}
						autoComplete="off"
						error={form.formState.errors.name?.message}
						label={t`Name`}
						maxLength={100}
						minLength={1}
						placeholder={t`new-channel`}
						required={true}
					/>
				</Modal.Content>
				<Modal.Footer>
					<Button onClick={ModalActionCreators.pop} variant="secondary">
						{t`Cancel`}
					</Button>
					<Button type="submit" submitting={form.formState.isSubmitting}>
						{t`Create Channel`}
					</Button>
				</Modal.Footer>
			</Form>
		</Modal.Root>
	);
});
