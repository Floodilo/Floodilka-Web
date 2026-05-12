/*
 * SPDX-License-Identifier: AGPL-3.0-or-later
 * Copyright (C) 2020-2026 Fluxer Contributors
 * Copyright (C) 2026 Floodilka Contributors
 * Modified by Floodilka Contributors starting March 2026. See LICENSE and NOTICE.
 */

import {ME} from '~/Constants';
import RuntimeConfigStore from '~/stores/RuntimeConfigStore';

interface BuildMessageLinkOptions {
	guildId?: string | null;
	channelId: string;
	messageId: string;
	includeProtocol?: boolean;
}

const DEFAULT_PROTOCOL = 'https:';

interface BuildChannelLinkOptions {
	guildId?: string | null;
	channelId: string;
	includeProtocol?: boolean;
}

const getProtocol = (includeProtocol?: boolean) => {
	if (!includeProtocol) {
		return DEFAULT_PROTOCOL;
	}

	if (typeof location !== 'undefined' && location.protocol) {
		return location.protocol;
	}

	return DEFAULT_PROTOCOL;
};

export function buildMessageJumpLink({
	guildId,
	channelId,
	messageId,
	includeProtocol = true,
}: BuildMessageLinkOptions): string {
	const resolvedGuildId = guildId ?? ME;
	const protocol = getProtocol(includeProtocol);

	return `${protocol}//${RuntimeConfigStore.marketingHost}/channels/${resolvedGuildId}/${channelId}/${messageId}`;
}

export function buildChannelLink({guildId, channelId, includeProtocol = true}: BuildChannelLinkOptions): string {
	const resolvedGuildId = guildId ?? ME;
	const protocol = getProtocol(includeProtocol);

	return `${protocol}//${RuntimeConfigStore.marketingHost}/channels/${resolvedGuildId}/${channelId}`;
}
