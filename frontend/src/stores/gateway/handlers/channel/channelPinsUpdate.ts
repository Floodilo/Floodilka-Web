/*
 * SPDX-License-Identifier: AGPL-3.0-or-later
 * Copyright (C) 2020-2026 Fluxer Contributors
 * Copyright (C) 2026 Floodilka Contributors
 * Modified by Floodilka Contributors starting March 2026. See LICENSE and NOTICE.
 */

import ChannelPinsStore from '~/stores/ChannelPinsStore';
import ReadStateStore from '~/stores/ReadStateStore';
import type {GatewayHandlerContext} from '../index';

interface ChannelPinsUpdatePayload {
	channel_id: string;
	last_pin_timestamp?: string | null;
}

export function handleChannelPinsUpdate(data: ChannelPinsUpdatePayload, _context: GatewayHandlerContext): void {
	if (data.last_pin_timestamp) {
		ReadStateStore.handleChannelPinsUpdate({
			channelId: data.channel_id,
			lastPinTimestamp: data.last_pin_timestamp,
		});
	}

	ChannelPinsStore.handleChannelPinsUpdate(data.channel_id, data.last_pin_timestamp ?? null);
}
