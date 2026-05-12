/*
 * SPDX-License-Identifier: AGPL-3.0-or-later
 * Copyright (C) 2020-2026 Fluxer Contributors
 * Copyright (C) 2026 Floodilka Contributors
 * Modified by Floodilka Contributors starting March 2026. See LICENSE and NOTICE.
 */

import {ChannelTypes} from '~/Constants';
import type {ChannelRecord} from '~/records/ChannelRecord';
import * as ChannelUtils from '~/utils/ChannelUtils';

export const isTextChannel = (ch: ChannelRecord) =>
	ch.type === ChannelTypes.GUILD_TEXT;

const isVoiceChannel = (ch: ChannelRecord) => ch.type === ChannelTypes.GUILD_VOICE;

export const isCategory = (ch: ChannelRecord) => ch.type === ChannelTypes.GUILD_CATEGORY;

interface ChannelGroup {
	category?: ChannelRecord;
	textChannels: Array<ChannelRecord>;
	voiceChannels: Array<ChannelRecord>;
}

export const organizeChannels = (channels: ReadonlyArray<ChannelRecord>): Array<ChannelGroup> => {
	const categories = channels.filter(isCategory).sort(ChannelUtils.compareChannels);
	const channelsByParent = new Map<string | null, Array<ChannelRecord>>();

	for (const channel of channels.filter((ch) => !isCategory(ch))) {
		const parentId = channel.parentId;
		if (!channelsByParent.has(parentId)) channelsByParent.set(parentId, []);
		channelsByParent.get(parentId)!.push(channel);
	}

	const groups: Array<ChannelGroup> = [];
	const nullChannels = channelsByParent.get(null) || [];
	groups.push({
		textChannels: nullChannels.filter(isTextChannel).sort(ChannelUtils.compareChannels),
		voiceChannels: nullChannels.filter(isVoiceChannel).sort(ChannelUtils.compareChannels),
	});

	for (const category of categories) {
		const categoryChannels = channelsByParent.get(category.id) || [];
		groups.push({
			category,
			textChannels: categoryChannels.filter(isTextChannel).sort(ChannelUtils.compareChannels),
			voiceChannels: categoryChannels.filter(isVoiceChannel).sort(ChannelUtils.compareChannels),
		});
	}

	return groups;
};
