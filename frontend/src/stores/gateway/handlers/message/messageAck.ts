/*
 * SPDX-License-Identifier: AGPL-3.0-or-later
 * Copyright (C) 2020-2026 Fluxer Contributors
 * Copyright (C) 2026 Floodilka Contributors
 * Modified by Floodilka Contributors starting March 2026. See LICENSE and NOTICE.
 */

import NotificationStore from '~/stores/NotificationStore';
import ReadStateStore from '~/stores/ReadStateStore';
import type {GatewayHandlerContext} from '../index';

interface MessageAckPayload {
	channel_id: string;
	message_id: string;
	mention_count: number;
	manual?: boolean;
}

export function handleMessageAck(data: MessageAckPayload, _context: GatewayHandlerContext): void {
	ReadStateStore.handleMessageAck({
		channelId: data.channel_id,
		messageId: data.message_id,
		mentionCount: data.mention_count,
		manual: data.manual ?? false,
	});
	NotificationStore.handleMessageAck({channelId: data.channel_id});
}
