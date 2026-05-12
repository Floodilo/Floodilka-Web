/*
 * SPDX-License-Identifier: AGPL-3.0-or-later
 * Copyright (C) 2020-2026 Fluxer Contributors
 * Copyright (C) 2026 Floodilka Contributors
 * Modified by Floodilka Contributors starting March 2026. See LICENSE and NOTICE.
 */

import MessageReferenceStore from '~/stores/MessageReferenceStore';
import MessageStore from '~/stores/MessageStore';
import NotificationStore from '~/stores/NotificationStore';
import ReadStateStore from '~/stores/ReadStateStore';
import type {GatewayHandlerContext} from '../index';

interface MessageDeleteBulkPayload {
	channel_id: string;
	ids: Array<string>;
}

export function handleMessageDeleteBulk(data: MessageDeleteBulkPayload, _context: GatewayHandlerContext): void {
	MessageStore.handleMessageDeleteBulk({channelId: data.channel_id, ids: data.ids});
	MessageReferenceStore.handleMessageDeleteBulk(data.channel_id, data.ids);
	ReadStateStore.handleMessageDelete({channelId: data.channel_id});
	NotificationStore.handleMessageDelete({channelId: data.channel_id});
}
