/*
 * SPDX-License-Identifier: AGPL-3.0-or-later
 * Copyright (C) 2020-2026 Fluxer Contributors
 * Copyright (C) 2026 Floodilka Contributors
 * Modified by Floodilka Contributors starting March 2026. See LICENSE and NOTICE.
 */

import {observer} from 'mobx-react-lite';
import React from 'react';
import {ME} from '~/Constants';
import {GuildLayout} from '~/components/layout/GuildLayout';
import {useLocation} from '~/lib/router';
import {Routes} from '~/Routes';
import ChannelStore from '~/stores/ChannelStore';
import MobileLayoutStore from '~/stores/MobileLayoutStore';
import SelectedChannelStore from '~/stores/SelectedChannelStore';
import {compareChannelPosition, filterViewableChannels} from '~/utils/channelShared';
import * as RouterUtils from '~/utils/RouterUtils';

export const GuildChannelRouter: React.FC<{guildId: string; children?: React.ReactNode}> = observer(
	({guildId, children}) => {
		const location = useLocation();

		React.useEffect(() => {
			if (guildId === ME || location.pathname === Routes.ME) {
				return;
			}

			if (MobileLayoutStore.enabled) {
				return;
			}

			if (location.pathname.startsWith('/channels/') && !location.pathname.startsWith(Routes.ME)) {
				if (location.pathname.split('/').length === 3) {
					const pathSegments = location.pathname.split('/');
					const currentGuildId = pathSegments[2];

					if (currentGuildId !== guildId) {
						return;
					}

					const selectedChannelId = SelectedChannelStore.selectedChannelIds.get(guildId);

					if (selectedChannelId) {
						const channel = ChannelStore.getChannel(selectedChannelId);
						if (channel && channel.guildId === guildId) {
							RouterUtils.replaceWith(Routes.guildChannel(guildId, selectedChannelId));
						} else {
							const channels = ChannelStore.getGuildChannels(guildId);
							const viewableChannels = filterViewableChannels(channels).sort(compareChannelPosition);

							if (viewableChannels.length > 0) {
								const firstChannel = viewableChannels[0];
								RouterUtils.replaceWith(Routes.guildChannel(guildId, firstChannel.id));
							}
						}
					} else {
						const channels = ChannelStore.getGuildChannels(guildId);
						const viewableChannels = filterViewableChannels(channels).sort(compareChannelPosition);

						if (viewableChannels.length > 0) {
							const firstChannel = viewableChannels[0];
							RouterUtils.replaceWith(Routes.guildChannel(guildId, firstChannel.id));
						}
					}
				}
			}
		}, [guildId, location.pathname, MobileLayoutStore.enabled]);

		if (guildId === ME || location.pathname === Routes.ME) {
			return null;
		}

		return <GuildLayout>{children}</GuildLayout>;
	},
);
