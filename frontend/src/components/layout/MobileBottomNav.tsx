/*
 * SPDX-License-Identifier: AGPL-3.0-or-later
 * Copyright (C) 2020-2026 Fluxer Contributors
 * Copyright (C) 2026 Floodilka Contributors
 * Modified by Floodilka Contributors starting March 2026. See LICENSE and NOTICE.
 */

import {Trans} from '@lingui/react/macro';
import {BellIcon, HouseIcon, SpeakerHighIcon} from '@phosphor-icons/react';
import {clsx} from 'clsx';
import {observer} from 'mobx-react-lite';
import React from 'react';
import {VoiceLobbyBottomSheet} from '~/components/bottomsheets/VoiceLobbyBottomSheet';
import {StatusAwareAvatar} from '~/components/uikit/StatusAwareAvatar';
import {useConnectedVoiceSession} from '~/hooks/useConnectedVoiceSession';
import {useLocation} from '~/lib/router';
import {Routes} from '~/Routes';
import type {UserRecord} from '~/records/UserRecord';
import * as RouterUtils from '~/utils/RouterUtils';
import styles from './MobileBottomNav.module.css';

interface MobileBottomNavProps {
	currentUser: UserRecord;
}

export const MobileBottomNav = observer(({currentUser}: MobileBottomNavProps) => {
	const location = useLocation();
	const lastChannelPathRef = React.useRef<string | null>(null);
	const [voiceLobbyOpen, setVoiceLobbyOpen] = React.useState(false);

	const isHomeActive = Routes.isChannelRoute(location.pathname);
	const isNotificationsActive = location.pathname === Routes.NOTIFICATIONS;
	const isYouActive = location.pathname === Routes.YOU;

	const {channel: voiceChannel, guild: voiceGuild, isConnected: isConnectedToVoice} = useConnectedVoiceSession();

	React.useEffect(() => {
		if (Routes.isChannelRoute(location.pathname)) {
			lastChannelPathRef.current = location.pathname;
		}
	}, [location.pathname]);

	const handleHomeNavigation = () => {
		if (lastChannelPathRef.current && (isNotificationsActive || isYouActive)) {
			RouterUtils.transitionTo(lastChannelPathRef.current);
		} else {
			RouterUtils.transitionTo(Routes.ME);
		}
	};

	const handleNavigation = (path: string) => {
		RouterUtils.transitionTo(path);
	};

	const handleVoiceIndicatorPress = () => {
		setVoiceLobbyOpen(true);
	};

	const handleCloseVoiceLobby = () => {
		setVoiceLobbyOpen(false);
	};

	return (
		<>
			<div className={styles.container}>
				<button
					type="button"
					onClick={handleHomeNavigation}
					className={clsx(styles.navButton, isHomeActive ? styles.navButtonActive : styles.navButtonInactive)}
				>
					<HouseIcon weight="fill" className={styles.icon} />
					<span className={styles.label}>
						<Trans>Home</Trans>
					</span>
				</button>

				{isConnectedToVoice && (
					<button
						type="button"
						onClick={handleVoiceIndicatorPress}
						className={clsx(styles.navButton, styles.voiceButton)}
					>
						<SpeakerHighIcon weight="fill" className={styles.icon} />
						<span className={styles.label}>
							<Trans>Voice</Trans>
						</span>
					</button>
				)}

				<button
					type="button"
					onClick={() => handleNavigation(Routes.NOTIFICATIONS)}
					className={clsx(styles.navButton, isNotificationsActive ? styles.navButtonActive : styles.navButtonInactive)}
				>
					<BellIcon weight="fill" className={styles.icon} />
					<span className={styles.label}>
						<Trans>Notifications</Trans>
					</span>
				</button>

				<button
					type="button"
					onClick={() => handleNavigation(Routes.YOU)}
					className={clsx(styles.navButton, isYouActive ? styles.navButtonActive : styles.navButtonInactive)}
				>
					<StatusAwareAvatar user={currentUser} size={24} showOffline={true} />
					<span className={styles.label}>
						<Trans>You</Trans>
					</span>
				</button>
			</div>

			{isConnectedToVoice && voiceChannel && voiceGuild && (
				<VoiceLobbyBottomSheet
					isOpen={voiceLobbyOpen}
					onClose={handleCloseVoiceLobby}
					channel={voiceChannel}
					guild={voiceGuild}
				/>
			)}
		</>
	);
});
