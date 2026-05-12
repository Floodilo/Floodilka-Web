/*
 * SPDX-License-Identifier: AGPL-3.0-or-later
 * Copyright (C) 2020-2026 Fluxer Contributors
 * Copyright (C) 2026 Floodilka Contributors
 * Modified by Floodilka Contributors starting March 2026. See LICENSE and NOTICE.
 */

import ReadStateStore from '~/stores/ReadStateStore';
import type {GatewayHandlerContext} from '../index';

interface ChannelPinsAckPayload {
	channel_id: string;
	last_pin_timestamp?: string | null;
}

export function handleChannelPinsAck(data: ChannelPinsAckPayload, _context: GatewayHandlerContext): void {
	ReadStateStore.handleChannelPinsAck({
		channelId: data.channel_id,
		timestamp: data.last_pin_timestamp ?? undefined,
	});
}
