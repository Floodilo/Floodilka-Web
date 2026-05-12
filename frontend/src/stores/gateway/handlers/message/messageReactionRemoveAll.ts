/*
 * SPDX-License-Identifier: AGPL-3.0-or-later
 * Copyright (C) 2020-2026 Fluxer Contributors
 * Copyright (C) 2026 Floodilka Contributors
 * Modified by Floodilka Contributors starting March 2026. See LICENSE and NOTICE.
 */

import ChannelPinsStore from '~/stores/ChannelPinsStore';
import MessageReactionsStore from '~/stores/MessageReactionsStore';
import MessageStore from '~/stores/MessageStore';
import RecentMentionsStore from '~/stores/RecentMentionsStore';
import SavedMessagesStore from '~/stores/SavedMessagesStore';
import type {GatewayHandlerContext} from '../index';

interface MessageReactionRemoveAllPayload {
	channel_id: string;
	message_id: string;
}

export function handleMessageReactionRemoveAll(
	data: MessageReactionRemoveAllPayload,
	_context: GatewayHandlerContext,
): void {
	SavedMessagesStore.handleMessageReactionRemoveAll(data.message_id);
	MessageReactionsStore.handleReactionRemoveAll(data.message_id);
	ChannelPinsStore.handleMessageReactionRemoveAll(data.channel_id, data.message_id);
	RecentMentionsStore.handleMessageReactionRemoveAll(data.message_id);
	MessageStore.handleRemoveAllReactions({channelId: data.channel_id, messageId: data.message_id});
}
