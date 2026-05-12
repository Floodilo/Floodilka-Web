/*
 * SPDX-License-Identifier: AGPL-3.0-or-later
 * Copyright (C) 2020-2026 Fluxer Contributors
 * Copyright (C) 2026 Floodilka Contributors
 * Modified by Floodilka Contributors starting March 2026. See LICENSE and NOTICE.
 */

import React from 'react';
import type {ChannelRecord} from '~/records/ChannelRecord';
import type {GuildRecord} from '~/records/GuildRecord';
import ChannelStore from '~/stores/ChannelStore';
import GuildStore from '~/stores/GuildStore';
import MediaEngineStore from '~/stores/voice/MediaEngineFacade';

export interface ConnectedVoiceSession {
	guildId: string | null;
	channelId: string | null;
	channel: ChannelRecord | null;
	guild: GuildRecord | null;
	isConnected: boolean;
}

export const useConnectedVoiceSession = (): ConnectedVoiceSession => {
	const channelId = MediaEngineStore.channelId;
	const guildId = MediaEngineStore.guildId;

	const channel = React.useMemo(() => (channelId ? (ChannelStore.getChannel(channelId) ?? null) : null), [channelId]);
	const guild = React.useMemo(() => (guildId ? (GuildStore.getGuild(guildId) ?? null) : null), [guildId]);

	return {
		channel,
		channelId,
		guild,
		guildId,
		isConnected: Boolean(channel && guild),
	};
};
