/*
 * SPDX-License-Identifier: AGPL-3.0-or-later
 * Copyright (C) 2020-2026 Fluxer Contributors
 * Copyright (C) 2026 Floodilka Contributors
 * Modified by Floodilka Contributors starting March 2026. See LICENSE and NOTICE.
 */

import {Trans, useLingui} from '@lingui/react/macro';
import {observer} from 'mobx-react-lite';
import type React from 'react';
import {StatusAwareAvatar} from '~/components/uikit/StatusAwareAvatar';
import UserStore from '~/stores/UserStore';
import styles from './PersonalNotesWelcomeSection.module.css';

interface PersonalNotesWelcomeSectionProps {
	userId: string;
}

export const PersonalNotesWelcomeSection: React.FC<PersonalNotesWelcomeSectionProps> = observer(({userId}) => {
	const {t} = useLingui();
	const user = UserStore.getUser(userId);

	if (!user) {
		return null;
	}

	return (
		<div className={styles.welcomeSection}>
			<div className={styles.avatarContainer}>
				<div className={styles.avatarBackground} />
				<StatusAwareAvatar user={user} size={80} disablePresence={true} className={styles.avatar} />
			</div>

			<h1 className={styles.title}>
				<Trans>Personal Notes</Trans>
			</h1>

			<div className={styles.dividerContainer}>
				<svg
					width="120"
					height="8"
					viewBox="0 0 120 8"
					className={styles.dividerSvg}
					role="img"
					aria-label={t`Decorative divider`}
				>
					<path
						d="M0,4 C10,0 15,8 25,4 C35,0 40,8 50,4 C60,0 65,8 75,4 C85,0 90,8 100,4 C110,0 115,8 120,4"
						stroke="currentColor"
						strokeWidth="1.5"
						fill="none"
					/>
				</svg>
			</div>

			<p className={styles.description}>
				<Trans>Your private space for thoughts and reminders</Trans>
			</p>
		</div>
	);
});
