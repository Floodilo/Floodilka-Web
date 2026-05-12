/*
 * SPDX-License-Identifier: AGPL-3.0-or-later
 * Copyright (C) 2020-2026 Fluxer Contributors
 * Copyright (C) 2026 Floodilka Contributors
 * Modified by Floodilka Contributors starting March 2026. See LICENSE and NOTICE.
 */

import {useLingui} from '@lingui/react/macro';
import {AtIcon, XIcon} from '@phosphor-icons/react';
import {observer} from 'mobx-react-lite';
import React from 'react';
import * as RecentMentionActionCreators from '~/actions/RecentMentionActionCreators';
import {MessageListPage} from '~/components/pages/MessageListPage';
import previewStyles from '~/components/shared/MessagePreview.module.css';
import type {MessageRecord} from '~/records/MessageRecord';
import RecentMentionsStore from '~/stores/RecentMentionsStore';
import styles from './RecentMentionsPage.module.css';

export const RecentMentionsPage = observer(() => {
	const {t} = useLingui();
	const recentMentions = RecentMentionsStore.recentMentions;
	const fetched = RecentMentionsStore.fetched;

	React.useEffect(() => {
		if (!fetched) {
			RecentMentionActionCreators.fetch();
		}
	}, [fetched]);

	const renderActionButtons = (message: MessageRecord) => (
		<button
			type="button"
			className={previewStyles.actionIconButton}
			onClick={() => RecentMentionActionCreators.remove(message.id)}
		>
			<XIcon weight="regular" className={previewStyles.actionIcon} />
		</button>
	);

	return (
		<MessageListPage
			icon={<AtIcon weight="bold" className={styles.icon} />}
			title={t`Recent Mentions`}
			messages={recentMentions.slice()}
			emptyStateTitle={t`No Recent Mentions`}
			emptyStateDescription={t`All @mentions of you will appear here for 7 days.`}
			endStateDescription={t`You've seen all your recent mentions. Don't fret, more will appear here soon`}
			renderActionButtons={renderActionButtons}
		/>
	);
});
