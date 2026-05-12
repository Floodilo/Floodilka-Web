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
import {STICKER_MAX_SIZE} from '~/Constants';
import {Form} from '~/components/form/Form';
import styles from '~/components/modals/AddGuildStickerModal.module.css';
import * as Modal from '~/components/modals/Modal';
import {StickerFormFields} from '~/components/modals/sticker-form/StickerFormFields';
import {StickerPreview} from '~/components/modals/sticker-form/StickerPreview';
import {Button} from '~/components/uikit/Button/Button';
import {useFormSubmit} from '~/hooks/useFormSubmit';
import * as ImageCropUtils from '~/utils/ImageCropUtils';

interface AddGuildStickerModalProps {
	guildId: string;
	file: File;
	onSuccess: () => void;
}

interface FormInputs {
	name: string;
	description: string;
	tags: Array<string>;
}

export const AddGuildStickerModal = observer(function AddGuildStickerModal({
	guildId,
	file,
	onSuccess,
}: AddGuildStickerModalProps) {
	const {t} = useLingui();
	const [isProcessing, setIsProcessing] = React.useState(false);
	const [previewUrl, setPreviewUrl] = React.useState<string | null>(null);

	const form = useForm<FormInputs>({
		defaultValues: {
			name: GuildStickerActionCreators.sanitizeStickerName(file.name),
			description: '',
			tags: [],
		},
	});

	React.useEffect(() => {
		const url = URL.createObjectURL(file);
		setPreviewUrl(url);
		return () => URL.revokeObjectURL(url);
	}, [file]);

	const onSubmit = React.useCallback(
		async (data: FormInputs) => {
			setIsProcessing(true);
			try {
				const base64Image = await ImageCropUtils.optimizeStickerImage(file, STICKER_MAX_SIZE, 320);

				await GuildStickerActionCreators.create(guildId, {
					name: data.name.trim(),
					description: data.description.trim(),
					tags: data.tags.length > 0 ? data.tags : [],
					image: base64Image,
				});

				onSuccess();
				ModalActionCreators.pop();
			} catch (error: any) {
				console.error('Failed to create sticker:', error);
				form.setError('name', {
					message: error.message || t`Failed to create sticker`,
				});
				setIsProcessing(false);
			}
		},
		[guildId, file, onSuccess, form],
	);

	const {handleSubmit: handleSave} = useFormSubmit({
		form,
		onSubmit,
		defaultErrorField: 'name',
	});

	return (
		<Modal.Root size="small" centered>
			<Modal.Header title={t`Add Sticker`} />
			<Modal.Content>
				<Form form={form} onSubmit={handleSave} aria-label={t`Add sticker form`}>
					<div className={styles.formContainer}>
						{previewUrl && <StickerPreview imageUrl={previewUrl} altText={form.watch('name') || file.name} />}
						<StickerFormFields form={form} disabled={isProcessing} />
					</div>
				</Form>
			</Modal.Content>
			<Modal.Footer>
				<Button variant="secondary" onClick={() => ModalActionCreators.pop()} disabled={isProcessing}>
					<Trans>Cancel</Trans>
				</Button>
				<Button onClick={handleSave} disabled={!form.watch('name')?.trim() || isProcessing} submitting={isProcessing}>
					<Trans>Create</Trans>
				</Button>
			</Modal.Footer>
		</Modal.Root>
	);
});
