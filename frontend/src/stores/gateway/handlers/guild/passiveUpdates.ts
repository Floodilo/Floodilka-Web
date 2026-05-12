/*
 * SPDX-License-Identifier: AGPL-3.0-or-later
 * Copyright (C) 2020-2026 Fluxer Contributors
 * Copyright (C) 2026 Floodilka Contributors
 * Modified by Floodilka Contributors starting March 2026. See LICENSE and NOTICE.
 */

import ReadStateStore from '~/stores/ReadStateStore';
import type {GatewayHandlerContext} from '../index';

interface PassiveUpdatesPayload {
	guild_id: string;
	channels: Record<string, string>;
}

export function handlePassiveUpdates(data: PassiveUpdatesPayload, _context: GatewayHandlerContext): void {
	const {channels} = data;

	for (const [channelId, lastMessageId] of Object.entries(channels)) {
		const state = ReadStateStore.getIfExists(channelId);
		if (state && state.lastMessageId !== lastMessageId) {
			state.lastMessageId = lastMessageId;
		}
	}
}
