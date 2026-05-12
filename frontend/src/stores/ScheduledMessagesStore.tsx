/*
 * SPDX-License-Identifier: AGPL-3.0-or-later
 * Copyright (C) 2020-2026 Fluxer Contributors
 * Copyright (C) 2026 Floodilka Contributors
 * Modified by Floodilka Contributors starting March 2026. See LICENSE and NOTICE.
 */

import {makeAutoObservable} from 'mobx';
import type {ScheduledMessageRecord} from '~/records/ScheduledMessageRecord';

class ScheduledMessagesStore {
	scheduledMessages: Array<ScheduledMessageRecord> = [];
	fetched = false;
	fetching = false;

	constructor() {
		makeAutoObservable(this, {}, {autoBind: true});
	}

	get hasScheduledMessages(): boolean {
		return this.scheduledMessages.length > 0;
	}

	fetchStart(): void {
		this.fetching = true;
	}

	fetchSuccess(messages: Array<ScheduledMessageRecord>): void {
		this.scheduledMessages = sortScheduledMessages(messages);
		this.fetching = false;
		this.fetched = true;
	}

	fetchError(): void {
		this.fetching = false;
		this.fetched = false;
		this.scheduledMessages = [];
	}

	upsert(message: ScheduledMessageRecord): void {
		const existingIndex = this.scheduledMessages.findIndex((entry) => entry.id === message.id);
		const next = [...this.scheduledMessages];
		if (existingIndex === -1) {
			next.push(message);
		} else {
			next[existingIndex] = message;
		}
		this.scheduledMessages = sortScheduledMessages(next);
	}

	remove(messageId: string): void {
		this.scheduledMessages = this.scheduledMessages.filter((message) => message.id !== messageId);
	}
}

function sortScheduledMessages(messages: Array<ScheduledMessageRecord>): Array<ScheduledMessageRecord> {
	return [...messages].sort((a, b) => a.scheduledAt.getTime() - b.scheduledAt.getTime());
}

export default new ScheduledMessagesStore();
