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
import * as GuildStickerActionCreators from '~/actions/GuildStickerActionCreators';
import * as ModalActionCreators from '~/actions/ModalActionCreators';
import {Form} from '~/components/form/Form';
import styles from '~/components/modals/EditGuildStickerModal.module.css';
import * as Modal from '~/components/modals/Modal';
import {StickerFormFields} from '~/components/modals/sticker-form/StickerFormFields';
import {StickerPreview} from '~/components/modals/sticker-form/StickerPreview';
import {Button} from '~/components/uikit/Button/Button';
import {useFormSubmit} from '~/hooks/useFormSubmit';
import {type GuildStickerWithUser, isStickerAnimated} from '~/records/GuildStickerRecord';
import * as AvatarUtils from '~/utils/AvatarUtils';

interface EditGuildStickerModalProps {
	guildId: string;
	sticker: GuildStickerWithUser;
	onUpdate: () => void;
}

interface FormInputs {
	name: string;
	description: string;
	tags: Array<string>;
}

export const EditGuildStickerModal = observer(function EditGuildStickerModal({
	guildId,
	sticker,
	onUpdate,
}: EditGuildStickerModalProps) {
	const {t} = useLingui();
	const form = useForm<FormInputs>({
		defaultValues: {
			name: sticker.name,
			description: sticker.description,
			tags: [...sticker.tags],
		},
	});

	const onSubmit = React.useCallback(
		async (data: FormInputs) => {
			try {
				await GuildStickerActionCreators.update(guildId, sticker.id, {
					name: data.name.trim(),
					description: data.description.trim(),
					tags: data.tags.length > 0 ? data.tags : [],
				});

				onUpdate();
				ModalActionCreators.pop();
			} catch (error: any) {
				console.error('Failed to update sticker:', error);
				form.setError('name', {
					message: error.message || t`Failed to update sticker`,
				});
			}
		},
		[guildId, sticker.id, onUpdate, form],
	);

	const {handleSubmit: handleSave} = useFormSubmit({
		form,
		onSubmit,
		defaultErrorField: 'name',
	});

	const stickerUrl = AvatarUtils.getStickerURL({
		id: sticker.id,
		animated: isStickerAnimated(sticker),
		size: 320,
	});

	return (
		<Modal.Root size="small" centered>
			<Modal.Header title={t`Edit Sticker`} />
			<Modal.Content>
				<Form form={form} onSubmit={handleSave}>
					<div className={styles.content}>
						<StickerPreview imageUrl={stickerUrl} altText={sticker.name} />
						<StickerFormFields form={form} />
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
