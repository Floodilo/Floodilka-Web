/*
 * SPDX-License-Identifier: AGPL-3.0-or-later
 * Copyright (C) 2020-2026 Fluxer Contributors
 * Copyright (C) 2026 Floodilka Contributors
 * Modified by Floodilka Contributors starting March 2026. See LICENSE and NOTICE.
 */

import {Trans} from '@lingui/react/macro';
import {clsx} from 'clsx';
import {observer} from 'mobx-react-lite';
import {useState} from 'react';
import * as ModalActionCreators from '~/actions/ModalActionCreators';
import styles from '~/components/modals/ChannelDeleteModal.module.css';
import confirmStyles from '~/components/modals/ConfirmModal.module.css';
import * as Modal from '~/components/modals/Modal';
import {Button} from '~/components/uikit/Button/Button';
import {
	type ChannelDeleteModalProps,
	deleteChannel,
	getChannelDeleteInfo,
} from '~/utils/modals/ChannelDeleteModalUtils';

export const ChannelDeleteModal = observer(({channelId}: ChannelDeleteModalProps) => {
	const deleteInfo = getChannelDeleteInfo(channelId);
	const [isSubmitting, setIsSubmitting] = useState(false);

	const onSubmit = async () => {
		if (!deleteInfo) return;

		setIsSubmitting(true);
		try {
			await deleteChannel(channelId);
		} finally {
			setIsSubmitting(false);
		}
	};

	if (!deleteInfo) return null;

	const {channel, isCategory, title, confirmText} = deleteInfo;

	return (
		<Modal.Root size="small" centered>
			<Modal.Header title={title} />
			<Modal.Content className={confirmStyles.content}>
				<p className={clsx(styles.message, confirmStyles.descriptionText)}>
					{isCategory ? (
						<Trans>
							Are you sure you want to delete <strong>{channel.name}</strong>? This cannot be undone.
						</Trans>
					) : (
						<Trans>
							Are you sure you want to delete <strong>{channel.name}</strong>? This cannot be undone.
						</Trans>
					)}
				</p>
			</Modal.Content>
			<Modal.Footer>
				<Button onClick={ModalActionCreators.pop} variant="secondary">
					<Trans>Cancel</Trans>
				</Button>
				<Button onClick={onSubmit} submitting={isSubmitting} variant="danger-primary">
					<Trans>{confirmText}</Trans>
				</Button>
			</Modal.Footer>
		</Modal.Root>
	);
});
