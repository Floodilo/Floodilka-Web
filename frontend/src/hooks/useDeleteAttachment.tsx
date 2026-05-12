/*
 * SPDX-License-Identifier: AGPL-3.0-or-later
 * Copyright (C) 2020-2026 Fluxer Contributors
 * Copyright (C) 2026 Floodilka Contributors
 * Modified by Floodilka Contributors starting March 2026. See LICENSE and NOTICE.
 */

import {Trans, useLingui} from '@lingui/react/macro';
import {useCallback} from 'react';
import * as MessageActionCreators from '~/actions/MessageActionCreators';
import * as ModalActionCreators from '~/actions/ModalActionCreators';
import {modal} from '~/actions/ModalActionCreators';
import {ConfirmModal} from '~/components/modals/ConfirmModal';
import type {MessageRecord} from '~/records/MessageRecord';

export const useDeleteAttachment = (message: MessageRecord | undefined, attachmentId: string | undefined) => {
	const {t} = useLingui();

	return useCallback(
		(e: React.MouseEvent) => {
			e.preventDefault();
			e.stopPropagation();

			if (!message || !attachmentId) return;

			ModalActionCreators.push(
				modal(() => (
					<ConfirmModal
						title={t`Delete Attachment`}
						description={
							<Trans>
								Are you sure you want to delete this attachment? This action cannot be undone and will remove the
								attachment from this message.
							</Trans>
						}
						primaryText={t`Delete Attachment`}
						primaryVariant="danger-primary"
						onPrimary={async () => {
							await MessageActionCreators.deleteAttachment(message.channelId, message.id, attachmentId);
						}}
					/>
				)),
			);
		},
		[message, attachmentId, t],
	);
};
