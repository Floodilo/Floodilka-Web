/*
 * SPDX-License-Identifier: AGPL-3.0-or-later
 * Copyright (C) 2020-2026 Fluxer Contributors
 * Copyright (C) 2026 Floodilka Contributors
 * Modified by Floodilka Contributors starting March 2026. See LICENSE and NOTICE.
 */

import {makeAutoObservable} from 'mobx';
import AuthenticationStore from '~/stores/AuthenticationStore';
import MessageStore from '~/stores/MessageStore';

type MessageReplyState = Readonly<{
	messageId: string;
	mentioning: boolean;
}>;

class MessageReplyStore {
	replyingMessageIds: Record<string, MessageReplyState> = {};
	highlightMessageId: string | null = null;

	constructor() {
		makeAutoObservable(this, {}, {autoBind: true});
	}

	isReplying(channelId: string, messageId: string): boolean {
		return this.replyingMessageIds[channelId]?.messageId === messageId;
	}

	isHighlight(messageId: string): boolean {
		return this.highlightMessageId === messageId;
	}

	startReply(channelId: string, messageId: string, mentioning: boolean): void {
		const message = MessageStore.getMessage(channelId, messageId);
		if (!message) {
			return;
		}

		const shouldMention =
			message.author.id === AuthenticationStore.currentUserId || message.webhookId ? false : mentioning;

		this.replyingMessageIds = {
			...this.replyingMessageIds,
			[channelId]: {messageId, mentioning: shouldMention},
		};
	}

	setMentioning(channelId: string, mentioning: boolean): void {
		const currentReply = this.replyingMessageIds[channelId];
		if (!currentReply) {
			return;
		}

		this.replyingMessageIds = {
			...this.replyingMessageIds,
			[channelId]: {
				...currentReply,
				mentioning,
			},
		};
	}

	stopReply(channelId: string): void {
		const {[channelId]: _, ...remainingReplies} = this.replyingMessageIds;
		this.replyingMessageIds = remainingReplies;
	}

	highlightMessage(messageId: string): void {
		this.highlightMessageId = messageId;
	}

	clearHighlight(): void {
		this.highlightMessageId = null;
	}

	getReplyingMessage(channelId: string): MessageReplyState | null {
		return this.replyingMessageIds[channelId] ?? null;
	}
}

export default new MessageReplyStore();
