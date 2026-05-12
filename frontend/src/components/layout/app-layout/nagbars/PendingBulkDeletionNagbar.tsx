/*
 * SPDX-License-Identifier: AGPL-3.0-or-later
 * Copyright (C) 2020-2026 Fluxer Contributors
 * Copyright (C) 2026 Floodilka Contributors
 * Modified by Floodilka Contributors starting March 2026. See LICENSE and NOTICE.
 */

import {Trans} from '@lingui/react/macro';
import {observer} from 'mobx-react-lite';
import React from 'react';
import * as ModalActionCreators from '~/actions/ModalActionCreators';
import {modal} from '~/actions/ModalActionCreators';
import * as NagbarActionCreators from '~/actions/NagbarActionCreators';
import {Nagbar} from '~/components/layout/Nagbar';
import {NagbarButton} from '~/components/layout/NagbarButton';
import {NagbarContent} from '~/components/layout/NagbarContent';
import {UserSettingsModal} from '~/components/modals/UserSettingsModal';
import UserStore from '~/stores/UserStore';

export const PendingBulkDeletionNagbar = observer(({isMobile}: {isMobile: boolean}) => {
	const pending = UserStore.currentUser?.getPendingBulkMessageDeletion();
	const countFormatter = React.useMemo(() => new Intl.NumberFormat(), []);
	const scheduleKey = pending?.scheduledAt.toISOString();
	const handleHideNagbar = React.useCallback(() => {
		if (!scheduleKey) {
			return;
		}

		NagbarActionCreators.dismissPendingBulkDeletionNagbar(scheduleKey);
	}, [scheduleKey]);

	if (!pending) {
		return null;
	}

	const channelCountLabel = countFormatter.format(pending.channelCount);
	const messageCountLabel = countFormatter.format(pending.messageCount);
	const scheduledLabel = pending.scheduledAt.toLocaleString();

	const openDeletionSettings = () => {
		ModalActionCreators.push(
			modal(() => <UserSettingsModal initialTab="privacy_safety" initialSubtab="data-deletion" />),
		);
	};

	return (
		<Nagbar
			isMobile={isMobile}
			backgroundColor="var(--status-danger)"
			textColor="#ffffff"
			dismissible
			onDismiss={handleHideNagbar}
		>
			<NagbarContent
				isMobile={isMobile}
				message={
					<Trans>
						Deletion of <strong>{messageCountLabel}</strong> messages from <strong>{channelCountLabel}</strong> channels
						is scheduled for <strong>{scheduledLabel}</strong>. Cancel it from the Privacy Dashboard.
					</Trans>
				}
				actions={
					<>
						{isMobile && (
							<NagbarButton isMobile={isMobile} onClick={handleHideNagbar}>
								<Trans>Dismiss</Trans>
							</NagbarButton>
						)}
						<NagbarButton isMobile={isMobile} onClick={openDeletionSettings}>
							<Trans>Review deletion</Trans>
						</NagbarButton>
					</>
				}
			/>
		</Nagbar>
	);
});
