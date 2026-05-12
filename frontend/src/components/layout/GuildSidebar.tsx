/*
 * SPDX-License-Identifier: AGPL-3.0-or-later
 * Copyright (C) 2020-2026 Fluxer Contributors
 * Copyright (C) 2026 Floodilka Contributors
 * Modified by Floodilka Contributors starting March 2026. See LICENSE and NOTICE.
 */

import {clsx} from 'clsx';
import {observer} from 'mobx-react-lite';
import type React from 'react';
import {useLocation} from '~/lib/router';
import {Routes} from '~/Routes';
import MobileLayoutStore from '~/stores/MobileLayoutStore';
import UserStore from '~/stores/UserStore';
import styles from './GuildNavbar.module.css';
import {UserArea} from './UserArea';

interface GuildSidebarProps {
	header: React.ReactNode;
	content: React.ReactNode;
	roundTopLeft?: boolean;
}

export const GuildSidebar = observer(({header, content, roundTopLeft = true}: GuildSidebarProps) => {
	const mobileLayout = MobileLayoutStore;
	const location = useLocation();
	const user = UserStore.currentUser;

	const showBottomNav =
		mobileLayout.enabled &&
		(location.pathname === Routes.ME ||
			location.pathname === Routes.NOTIFICATIONS ||
			location.pathname === Routes.YOU ||
			(Routes.isGuildChannelRoute(location.pathname) && location.pathname.split('/').length === 3));

	return (
		<div
			className={clsx(
				styles.guildNavbarContainer,
				mobileLayout.enabled && styles.guildNavbarContainerMobile,
				showBottomNav && styles.guildNavbarReserveMobileBottomNav,
			)}
			style={roundTopLeft ? undefined : {borderTopLeftRadius: 0}}
		>
			{header}
			{content}
			{!mobileLayout.enabled && user && (
				<div className={styles.userAreaSlot}>
					<UserArea user={user} />
				</div>
			)}
		</div>
	);
});
