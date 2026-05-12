/*
 * SPDX-License-Identifier: AGPL-3.0-or-later
 * Copyright (C) 2020-2026 Fluxer Contributors
 * Copyright (C) 2026 Floodilka Contributors
 * Modified by Floodilka Contributors starting March 2026. See LICENSE and NOTICE.
 */

import {Trans} from '@lingui/react/macro';
import {BookmarkSimpleIcon} from '@phosphor-icons/react';
import {observer} from 'mobx-react-lite';
import styles from './NotificationsPage.module.css';

interface NotificationsPageProps {
	onBookmarksClick: () => void;
}

export const NotificationsPage = observer(({onBookmarksClick}: NotificationsPageProps) => {
	return (
		<div className={styles.container}>
			<div className={styles.header}>
				<h1 className={styles.title}>
					<Trans>Notifications</Trans>
				</h1>
				<button type="button" onClick={onBookmarksClick} className={styles.bookmarkButton}>
					<BookmarkSimpleIcon weight="fill" className={styles.bookmarkIcon} />
				</button>
			</div>
			<div className={styles.emptyContainer}>
				<div className={styles.emptyContent}>
					<p className={styles.emptyTitle}>
						<Trans>No notifications</Trans>
					</p>
					<p className={styles.emptyText}>
						<Trans>You're all caught up!</Trans>
					</p>
				</div>
			</div>
		</div>
	);
});
