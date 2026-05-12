/*
 * SPDX-License-Identifier: AGPL-3.0-or-later
 * Copyright (C) 2020-2026 Fluxer Contributors
 * Copyright (C) 2026 Floodilka Contributors
 * Modified by Floodilka Contributors starting March 2026. See LICENSE and NOTICE.
 */

import ChannelPinsStore from '~/stores/ChannelPinsStore';
import MessageReferenceStore from '~/stores/MessageReferenceStore';
import MessageStore from '~/stores/MessageStore';
import NotificationStore from '~/stores/NotificationStore';
import ReadStateStore from '~/stores/ReadStateStore';
import RecentMentionsStore from '~/stores/RecentMentionsStore';
import SavedMessagesStore from '~/stores/SavedMessagesStore';
import type {GatewayHandlerContext} from '../index';

interface MessageDeletePayload {
	id: string;
	channel_id: string;
}

export function handleMessageDelete(data: MessageDeletePayload, _context: GatewayHandlerContext): void {
	SavedMessagesStore.handleMessageDelete(data.id);
	ChannelPinsStore.handleMessageDelete(data.channel_id, data.id);
	MessageStore.handleMessageDelete({channelId: data.channel_id, id: data.id});
	MessageReferenceStore.handleMessageDelete(data.channel_id, data.id);
	ReadStateStore.handleMessageDelete({channelId: data.channel_id});
	RecentMentionsStore.handleMessageDelete(data.id);
	NotificationStore.handleMessageDelete({channelId: data.channel_id});
}
