/*
 * SPDX-License-Identifier: AGPL-3.0-or-later
 * Copyright (C) 2020-2026 Fluxer Contributors
 * Copyright (C) 2026 Floodilka Contributors
 * Modified by Floodilka Contributors starting March 2026. See LICENSE and NOTICE.
 */

import * as MessageActionCreators from '~/actions/MessageActionCreators';
import {type JumpTypes, ME} from '~/Constants';
import {Routes} from '~/Routes';
import ChannelStore from '~/stores/ChannelStore';
import * as RouterUtils from '~/utils/RouterUtils';

interface MessageJumpOptions {
	flash?: boolean;
	offset?: number;
	returnTargetId?: string;
	jumpType?: JumpTypes;
}

export const buildMessagePath = (channelId: string, messageId: string): string => {
	const channel = ChannelStore.getChannel(channelId);
	const guildId = channel?.guildId;

	if (guildId && guildId !== ME) {
		return Routes.channelMessage(guildId, channelId, messageId);
	}

	return Routes.dmChannelMessage(channelId, messageId);
};

export const goToMessage = (channelId: string, messageId: string, options?: MessageJumpOptions): void => {
	const path = buildMessagePath(channelId, messageId);
	RouterUtils.transitionTo(path);
	MessageActionCreators.jumpToMessage(
		channelId,
		messageId,
		options?.flash ?? true,
		options?.offset,
		options?.returnTargetId,
		options?.jumpType,
	);
};

export const parseMessagePath = (path: string): {channelId: string; messageId: string} | null => {
	const parts = path.split('/').filter(Boolean);
	if (parts.length < 4) return null;
	if (parts[0] !== 'channels') return null;

	const channelId = parts[2];
	const messageId = parts[3];

	if (!channelId || !messageId) return null;
	return {channelId, messageId};
};
