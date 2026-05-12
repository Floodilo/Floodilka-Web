/*
 * SPDX-License-Identifier: AGPL-3.0-or-later
 * Copyright (C) 2020-2026 Fluxer Contributors
 * Copyright (C) 2026 Floodilka Contributors
 * Modified by Floodilka Contributors starting March 2026. See LICENSE and NOTICE.
 */

import {clsx} from 'clsx';
import {observer} from 'mobx-react-lite';
import type React from 'react';
import {UserTag} from '~/components/channel/UserTag';
import FocusRing from '~/components/uikit/FocusRing/FocusRing';
import type {UserRecord} from '~/records/UserRecord';
import styles from './ProfileCardUserInfo.module.css';

interface ProfileCardUserInfoProps {
	displayName: string;
	user: UserRecord;
	showUsername?: boolean;
	isClickable?: boolean;
	isWebhook?: boolean;
	onDisplayNameClick?: () => void;
	onUsernameClick?: () => void;
	actions?: React.ReactNode;
	usernameActions?: React.ReactNode;
}

export const ProfileCardUserInfo: React.FC<ProfileCardUserInfoProps> = observer(
	({
		displayName,
		user,
		showUsername = true,
		isClickable = true,
		isWebhook = false,
		onDisplayNameClick,
		onUsernameClick,
		actions,
		usernameActions,
	}) => {
		return (
			<div className={styles.userInfoContainer}>
				<div className={styles.nameRow}>
					<FocusRing offset={-2}>
						<button
							type="button"
							onClick={onDisplayNameClick}
							className={clsx(styles.nameButton, isClickable && styles.nameButtonClickable)}
						>
							{displayName}
						</button>
					</FocusRing>

					<div className={styles.badgeContainer}>
						{(user.bot || isWebhook) && <UserTag className={styles.userTagWrapper} system={user.system} />}
					</div>

					{actions && <div className={styles.actionsContainer}>{actions}</div>}
				</div>

				{showUsername && (
					<div className={styles.usernameRow}>
						<FocusRing offset={-2}>
							<button type="button" onClick={onUsernameClick} className={styles.usernameButton}>
								{user.tag}
							</button>
						</FocusRing>
						{usernameActions}
					</div>
				)}

				</div>
		);
	},
);
