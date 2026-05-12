/*
 * SPDX-License-Identifier: AGPL-3.0-or-later
 * Copyright (C) 2020-2026 Fluxer Contributors
 * Copyright (C) 2026 Floodilka Contributors
 * Modified by Floodilka Contributors starting March 2026. See LICENSE and NOTICE.
 */

import {useLingui} from '@lingui/react/macro';
import {BookmarkSimpleIcon, XIcon} from '@phosphor-icons/react';
import {observer} from 'mobx-react-lite';
import React from 'react';
import * as SavedMessageActionCreators from '~/actions/SavedMessageActionCreators';
import {MessageListPage} from '~/components/pages/MessageListPage';
import previewStyles from '~/components/shared/MessagePreview.module.css';
import {SavedMessageMissingCard} from '~/components/shared/SavedMessageMissingCard';
import type {MessageRecord} from '~/records/MessageRecord';
import SavedMessagesStore from '~/stores/SavedMessagesStore';
import styles from './SavedMessagesPage.module.css';

export const SavedMessagesPage = observer(() => {
	const {t, i18n} = useLingui();
	const {savedMessages, missingSavedMessages, fetched} = SavedMessagesStore;

	React.useEffect(() => {
		if (!fetched) {
			SavedMessageActionCreators.fetch();
		}
	}, [fetched]);

	const renderActionButtons = (message: MessageRecord) => (
		<button
			type="button"
			className={previewStyles.actionIconButton}
			onClick={() => SavedMessageActionCreators.remove(i18n, message.id)}
		>
			<XIcon weight="regular" className={previewStyles.actionIcon} />
		</button>
	);

	return (
		<div>
			{missingSavedMessages.length > 0 && (
				<div className={styles.missingList}>
					{missingSavedMessages.map((entry) => (
						<SavedMessageMissingCard
							key={entry.id}
							entryId={entry.id}
							onRemove={() => SavedMessageActionCreators.remove(i18n, entry.id)}
						/>
					))}
				</div>
			)}
			<MessageListPage
				icon={<BookmarkSimpleIcon className={styles.icon} />}
				title={t`Bookmarks`}
				messages={savedMessages.slice()}
				emptyStateTitle={t`No Bookmarks`}
				emptyStateDescription={t`Bookmark messages to save them for later.`}
				endStateDescription={t`There's nothing more to see here.`}
				renderActionButtons={renderActionButtons}
			/>
		</div>
	);
});
