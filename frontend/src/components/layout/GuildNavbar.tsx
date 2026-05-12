/*
 * SPDX-License-Identifier: AGPL-3.0-or-later
 * Copyright (C) 2020-2026 Fluxer Contributors
 * Copyright (C) 2026 Floodilka Contributors
 * Modified by Floodilka Contributors starting March 2026. See LICENSE and NOTICE.
 */

import {useMotionValue} from 'framer-motion';
import {observer} from 'mobx-react-lite';
import React from 'react';
import {useHotkeys} from 'react-hotkeys-hook';
import * as UserGuildSettingsActionCreators from '~/actions/UserGuildSettingsActionCreators';
import {ChannelTypes} from '~/Constants';
import {useNativePlatform} from '~/hooks/useNativePlatform';
import type {GuildRecord} from '~/records/GuildRecord';
import ChannelStore from '~/stores/ChannelStore';
import {TopNagbarContext} from './app-layout/TopNagbarContext';
import {ChannelListContent} from './ChannelListContent';
import {GuildHeader} from './GuildHeader';
import {GuildSidebar} from './GuildSidebar';

export const GuildNavbar = observer(({guild}: {guild: GuildRecord}) => {
	const scrollY = useMotionValue(0);
	const {isNative, isWindows, isLinux} = useNativePlatform();
	const hasTopNagbar = React.useContext(TopNagbarContext);
	const shouldRoundTopLeft = isNative && (isWindows || isLinux) && !hasTopNagbar;

	React.useEffect(() => {
		scrollY.set(0);
	}, [guild.id, scrollY]);

	const channels = ChannelStore.getGuildChannels(guild.id);

	const categoryIds = React.useMemo(() => {
		return channels.filter((ch) => ch.type === ChannelTypes.GUILD_CATEGORY).map((ch) => ch.id);
	}, [channels]);

	useHotkeys(
		'mod+shift+a',
		() => {
			if (categoryIds.length > 0) {
				UserGuildSettingsActionCreators.toggleAllCategoriesCollapsed(guild.id, categoryIds);
			}
		},
		{
			enableOnFormTags: true,
			enableOnContentEditable: true,
			preventDefault: true,
		},
		[guild.id, categoryIds],
	);

	return (
		<GuildSidebar
			roundTopLeft={shouldRoundTopLeft}
			header={<GuildHeader guild={guild} />}
			content={<ChannelListContent guild={guild} scrollY={scrollY} />}
		/>
	);
});
