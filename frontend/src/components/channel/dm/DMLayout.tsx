/*
 * SPDX-License-Identifier: AGPL-3.0-or-later
 * Copyright (C) 2020-2026 Fluxer Contributors
 * Copyright (C) 2026 Floodilka Contributors
 * Modified by Floodilka Contributors starting March 2026. See LICENSE and NOTICE.
 */

import {observer} from 'mobx-react-lite';
import React from 'react';
import * as NavigationActionCreators from '~/actions/NavigationActionCreators';
import {ME} from '~/Constants';
import {DMChannelView} from '~/components/channel/channel-view/DMChannelView';
import {DMFriendsView} from '~/components/channel/dm/DMFriendsView';
import {DMList} from '~/components/channel/dm/DMList';
import {RecentMentionsPage} from '~/components/pages/RecentMentionsPage';
import {SavedMessagesPage} from '~/components/pages/SavedMessagesPage';
import {useLocation, useParams} from '~/lib/router';
import {Routes} from '~/Routes';
import MobileLayoutStore from '~/stores/MobileLayoutStore';
import styles from './DMLayout.module.css';

export const DMLayout = observer(({children}: {children?: React.ReactNode}) => {
	const {channelId, messageId} = useParams() as {channelId?: string; messageId?: string};
	const location = useLocation();
	const mobileLayout = MobileLayoutStore;

	React.useEffect(() => {
		if (Routes.isDMRoute(location.pathname)) {
			NavigationActionCreators.deselectGuild();
		}
	}, [location.pathname]);

	React.useEffect(() => {
		if (Routes.isDMRoute(location.pathname) && channelId) {
			NavigationActionCreators.selectChannel(ME, channelId, messageId);
		}
	}, [channelId, messageId, location.pathname]);

	const renderContent = () => {
		if (location.pathname === Routes.BOOKMARKS) {
			return <SavedMessagesPage />;
		}
		if (location.pathname === Routes.MENTIONS) {
			return <RecentMentionsPage />;
		}
		if (channelId) {
			return <DMChannelView channelId={channelId} />;
		}
		if (children) {
			return children;
		}
		return <DMFriendsView />;
	};

	if (mobileLayout.enabled) {
		if (!channelId && !children) {
			return (
				<div className={styles.dmListColumn}>
					<DMList />
				</div>
			);
		}
		return (
			<div className={styles.contentColumn}>
				<div className={styles.contentInner}>{renderContent()}</div>
			</div>
		);
	}

	return (
		<div className={styles.dmLayoutContainer}>
			<div className={styles.dmListColumn}>
				<DMList />
			</div>
			<div className={styles.contentColumn}>
				<div className={styles.contentInner}>{renderContent()}</div>
			</div>
		</div>
	);
});
