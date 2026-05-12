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
import {MessageAttachmentFlags} from '~/Constants';
import {Form} from '~/components/form/Form';
import {Input} from '~/components/form/Input';
import {Switch} from '~/components/form/Switch';
import styles from '~/components/modals/AttachmentEditModal.module.css';
import * as Modal from '~/components/modals/Modal';
import {Button} from '~/components/uikit/Button/Button';
import {type CloudAttachment, CloudUpload} from '~/lib/CloudUpload';

interface FormInputs {
	filename: string;
	spoiler: boolean;
}

export const AttachmentEditModal = observer(
	({channelId, attachment}: {channelId: string; attachment: CloudAttachment}) => {
		const {t} = useLingui();
		const defaultSpoiler = (attachment.flags & MessageAttachmentFlags.IS_SPOILER) !== 0;

		const form = useForm<FormInputs>({
			defaultValues: {
				filename: attachment.filename,
				spoiler: defaultSpoiler,
			},
		});

		const onSubmit = async (data: FormInputs) => {
			const nextFlags = data.spoiler
				? attachment.flags | MessageAttachmentFlags.IS_SPOILER
				: attachment.flags & ~MessageAttachmentFlags.IS_SPOILER;

			CloudUpload.updateAttachment(channelId, attachment.id, {
				filename: data.filename,
				flags: nextFlags,
				spoiler: data.spoiler,
			});

			ModalActionCreators.pop();
		};

		return (
			<Modal.Root size="small" centered>
				<Form form={form} onSubmit={onSubmit} aria-label={t`Edit attachment form`}>
					<Modal.Header title={attachment.filename} />
					<Modal.Content className={styles.content}>
						<Input
							{...form.register('filename')}
							autoFocus={true}
							label={t`Filename`}
							minLength={1}
							maxLength={512}
							required={true}
							type="text"
							spellCheck={false}
						/>
						<Switch
							label={t`Mark as spoiler`}
							value={form.watch('spoiler')}
							onChange={(value) => form.setValue('spoiler', value)}
						/>
					</Modal.Content>
					<Modal.Footer>
						<Button onClick={ModalActionCreators.pop} variant="secondary">
							<Trans>Cancel</Trans>
						</Button>
						<Button type="submit">
							<Trans>Save</Trans>
						</Button>
					</Modal.Footer>
				</Form>
			</Modal.Root>
		);
	},
);
