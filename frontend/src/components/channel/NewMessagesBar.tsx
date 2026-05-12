/*
 * SPDX-License-Identifier: AGPL-3.0-or-later
 * Copyright (C) 2020-2026 Fluxer Contributors
 * Copyright (C) 2026 Floodilka Contributors
 * Modified by Floodilka Contributors starting March 2026. See LICENSE and NOTICE.
 */

import {useLingui} from '@lingui/react/macro';
import {CheckIcon} from '@phosphor-icons/react';
import {observer} from 'mobx-react-lite';
import MobileLayoutStore from '~/stores/MobileLayoutStore';
import * as DateUtils from '~/utils/DateUtils';
import styles from './Messages.module.css';

export const NewMessagesBar = observer(function NewMessagesBar({
	unreadCount,
	oldestUnreadTimestamp,
	isEstimated,
	onJumpToNewMessages,
}: {
	unreadCount: number;
	oldestUnreadTimestamp: number;
	isEstimated: boolean;
	onJumpToNewMessages: () => void;
}) {
	const {t} = useLingui();

	const isMobile = MobileLayoutStore.isMobileLayout();
	const sameDay = DateUtils.isSameDay(oldestUnreadTimestamp);
	const compactTime = DateUtils.getFormattedCompactDateTime(oldestUnreadTimestamp);
	const shortTime = sameDay ? DateUtils.getFormattedTime(oldestUnreadTimestamp) : compactTime;

	return (
		<button type="button" className={styles.newMessagesBar} onClick={onJumpToNewMessages}>
			<span className={styles.newMessagesBarText}>
				{isEstimated
					? isMobile
						? t`${unreadCount}+ new since ${shortTime}`
						: t`${unreadCount}+ new messages since ${compactTime}`
					: isMobile
						? t`${unreadCount} new since ${shortTime}`
						: unreadCount === 1
							? t`${unreadCount} new message since ${compactTime}`
							: t`${unreadCount} new messages since ${compactTime}`}
			</span>

			<span className={styles.newMessagesBarAction}>
				<span>{isMobile ? t`Mark Read` : t`Mark as Read`}</span>
				<CheckIcon weight="bold" size={16} />
			</span>
		</button>
	);
});
