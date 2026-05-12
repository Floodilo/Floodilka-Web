/*
 * SPDX-License-Identifier: AGPL-3.0-or-later
 * Copyright (C) 2020-2026 Fluxer Contributors
 * Copyright (C) 2026 Floodilka Contributors
 * Modified by Floodilka Contributors starting March 2026. See LICENSE and NOTICE.
 */

import ChannelStore from '~/stores/ChannelStore';

export interface ChannelTopicModalProps {
	channelId: string;
}

export const getChannelTopicInfo = (channelId: string) => {
	const channel = ChannelStore.getChannel(channelId);
	if (!channel || !channel.topic) return null;

	return {
		channel,
		topic: channel.topic,
		title: `#${channel.name}`,
	};
};
