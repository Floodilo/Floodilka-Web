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

interface MessageReactionRemovePayload {
	user_id: string;
	channel_id: string;
	message_id: string;
	emoji: ReactionEmojiPayload;
}

export function handleMessageReactionRemove(data: MessageReactionRemovePayload, _context: GatewayHandlerContext): void {
	const emoji = data.emoji as ReactionEmoji;

	SavedMessagesStore.handleMessageReactionRemove(data.message_id, data.user_id, emoji);
	MessageReactionsStore.handleReactionRemove(data.message_id, data.user_id, emoji);
	ChannelPinsStore.handleMessageReactionRemove(data.channel_id, data.message_id, data.user_id, emoji);
	RecentMentionsStore.handleMessageReactionRemove(data.message_id, data.user_id, emoji);
	MessageStore.handleReaction({
		type: 'MESSAGE_REACTION_REMOVE',
		channelId: data.channel_id,
		messageId: data.message_id,
		userId: data.user_id,
		emoji,
	});
}
