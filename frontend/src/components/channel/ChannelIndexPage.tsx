/*
 * SPDX-License-Identifier: AGPL-3.0-or-later
 * Copyright (C) 2020-2026 Fluxer Contributors
 * Copyright (C) 2026 Floodilka Contributors
 * Modified by Floodilka Contributors starting March 2026. See LICENSE and NOTICE.
 */

import {observer} from 'mobx-react-lite';
import {DMChannelView} from '~/components/channel/channel-view/DMChannelView';
import {GuildChannelView} from '~/components/channel/channel-view/GuildChannelView';
import {useParams} from '~/lib/router';
import ChannelStore from '~/stores/ChannelStore';

export const ChannelIndexPage = observer(() => {
	const {
		guildId: routeGuildId,
		channelId,
		messageId,
	} = useParams() as {
		guildId?: string;
		channelId?: string;
		messageId?: string;
	};

	if (!channelId) {
		return null;
	}

	const channel = ChannelStore.getChannel(channelId);
	const derivedGuildId = routeGuildId || channel?.guildId;

	if (channel?.isPrivate()) {
		return <DMChannelView channelId={channelId} />;
	}

	return <GuildChannelView channelId={channelId} guildId={derivedGuildId} messageId={messageId} />;
});
