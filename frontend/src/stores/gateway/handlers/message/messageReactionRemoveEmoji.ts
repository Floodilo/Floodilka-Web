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
import type {ReactionEmoji} from '~/utils/ReactionUtils';
import type {GatewayHandlerContext} from '../index';

interface ReactionEmojiPayload {
	id?: string | null;
	name?: string | null;
}

interface MessageReactionRemoveEmojiPayload {
	channel_id: string;
	message_id: string;
	emoji: ReactionEmojiPayload;
}

export function handleMessageReactionRemoveEmoji(
	data: MessageReactionRemoveEmojiPayload,
	_context: GatewayHandlerContext,
): void {
	const emoji = data.emoji as ReactionEmoji;

	SavedMessagesStore.handleMessageReactionRemoveEmoji(data.message_id, emoji);
	MessageReactionsStore.handleReactionRemoveEmoji(data.message_id, emoji);
	ChannelPinsStore.handleMessageReactionRemoveEmoji(data.channel_id, data.message_id, emoji);
	RecentMentionsStore.handleMessageReactionRemoveEmoji(data.message_id, emoji);
	MessageStore.handleRemoveAllReactions({channelId: data.channel_id, messageId: data.message_id});
}
