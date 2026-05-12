/*
 * SPDX-License-Identifier: AGPL-3.0-or-later
 * Copyright (C) 2020-2026 Fluxer Contributors
 * Copyright (C) 2026 Floodilka Contributors
 * Modified by Floodilka Contributors starting March 2026. See LICENSE and NOTICE.
 */

import type {Message} from '~/records/MessageRecord';
import CallStateStore from '~/stores/CallStateStore';
import ChannelPinsStore from '~/stores/ChannelPinsStore';
import MessageStore from '~/stores/MessageStore';
import RecentMentionsStore from '~/stores/RecentMentionsStore';
import SavedMessagesStore from '~/stores/SavedMessagesStore';
import type {GatewayHandlerContext} from '../index';

interface MessageUpdatePayload {
	id: string;
	channel_id?: string;
}

export function handleMessageUpdate(data: MessageUpdatePayload, _context: GatewayHandlerContext): void {
	const message = data as Message;

	SavedMessagesStore.handleMessageUpdate(message);
	ChannelPinsStore.handleMessageUpdate(message);
	MessageStore.handleMessageUpdate({message});
	RecentMentionsStore.handleMessageUpdate(message);
	if (message.channel_id && message.call) {
		CallStateStore.handleCallParticipants(message.channel_id, message.call.participants);
	}
}
