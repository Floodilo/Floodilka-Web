/*
 * SPDX-License-Identifier: AGPL-3.0-or-later
 * Copyright (C) 2020-2026 Fluxer Contributors
 * Copyright (C) 2026 Floodilka Contributors
 * Modified by Floodilka Contributors starting March 2026. See LICENSE and NOTICE.
 */

import AuthenticationStore from '~/stores/AuthenticationStore';
import ChannelStore from '~/stores/ChannelStore';

export interface GroupDmInviteCounts {
	memberCount: number;
	hasLocalChannel: boolean;
}

export const getGroupDmInviteCounts = (params: {
	channelId: string;
	inviteMemberCount?: number | null;
}): GroupDmInviteCounts => {
	const channel = ChannelStore.getChannel(params.channelId);
	if (!channel) {
		return {
			memberCount: params.inviteMemberCount ?? 0,
			hasLocalChannel: false,
		};
	}

	const memberIds = new Set(channel.recipientIds);
	const currentUserId = AuthenticationStore.currentUserId;
	if (currentUserId) {
		memberIds.add(currentUserId);
	}

	return {
		memberCount: memberIds.size,
		hasLocalChannel: true,
	};
};
