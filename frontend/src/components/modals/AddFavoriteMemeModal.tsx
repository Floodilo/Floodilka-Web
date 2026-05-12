/*
 * SPDX-License-Identifier: AGPL-3.0-or-later
 * Copyright (C) 2020-2026 Fluxer Contributors
 * Copyright (C) 2026 Floodilka Contributors
 * Modified by Floodilka Contributors starting March 2026. See LICENSE and NOTICE.
 */

import {Trans, useLingui} from '@lingui/react/macro';
import {observer} from 'mobx-react-lite';
import React from 'react';
import {useForm} from 'react-hook-form';
import * as FavoriteMemeActionCreators from '~/actions/FavoriteMemeActionCreators';
import * as ModalActionCreators from '~/actions/ModalActionCreators';
import {Form} from '~/components/form/Form';
import styles from '~/components/modals/AddFavoriteMemeModal.module.css';
import * as Modal from '~/components/modals/Modal';
import {MemeFormFields} from '~/components/modals/meme-form/MemeFormFields';
import {Button} from '~/components/uikit/Button/Button';
import {useFormSubmit} from '~/hooks/useFormSubmit';

interface AddFavoriteMemeModalProps {
	channelId: string;
	messageId: string;
	attachmentId?: string;
	embedIndex?: number;
	defaultName?: string;
	defaultAltText?: string;
}

interface FormInputs {
	name: string;
	altText?: string;
	tags: Array<string>;
}

export const AddFavoriteMemeModal = observer(function AddFavoriteMemeModal({
	channelId,
	messageId,
	attachmentId,
	embedIndex,
	defaultName = '',
	defaultAltText = '',
}: AddFavoriteMemeModalProps) {
	const {t, i18n} = useLingui();
	const form = useForm<FormInputs>({
		defaultValues: {
			name: defaultName,
			altText: defaultAltText,
			tags: [],
		},
	});

	const onSubmit = React.useCallback(
		async (data: FormInputs) => {
			await FavoriteMemeActionCreators.createFavoriteMeme(i18n, {
				channelId,
				messageId,
				attachmentId,
				embedIndex,
				name: data.name.trim(),
				altText: data.altText?.trim() || undefined,
				tags: data.tags.length > 0 ? data.tags : undefined,
			});
			ModalActionCreators.pop();
		},
		[channelId, messageId, attachmentId, embedIndex],
	);

	const {handleSubmit: handleSave} = useFormSubmit({
		form,
		onSubmit,
		defaultErrorField: 'name',
	});

	return (
		<Modal.Root size="small" centered>
			<Modal.Header title={t`Add to Saved Media`} />
			<Modal.Content>
				<Form form={form} onSubmit={handleSave}>
					<div className={styles.formContainer}>
						<MemeFormFields form={form} />
					</div>
				</Form>
			</Modal.Content>
			<Modal.Footer>
				<Button variant="secondary" onClick={() => ModalActionCreators.pop()}>
					<Trans>Cancel</Trans>
				</Button>
				<Button onClick={handleSave} disabled={!form.watch('name')?.trim() || form.formState.isSubmitting}>
					<Trans>Save</Trans>
				</Button>
			</Modal.Footer>
		</Modal.Root>
	);
});
