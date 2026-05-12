/*
 * SPDX-License-Identifier: AGPL-3.0-or-later
 * Copyright (C) 2020-2026 Fluxer Contributors
 * Copyright (C) 2026 Floodilka Contributors
 * Modified by Floodilka Contributors starting March 2026. See LICENSE and NOTICE.
 */

import {makeAutoObservable, observable} from 'mobx';
import type {MessageRecord} from '~/records/MessageRecord';

const MAX_QUEUE_LENGTH = 5;

class MobileMentionToastStore {
	queue: Array<MessageRecord> = [];

	constructor() {
		makeAutoObservable(this, {queue: observable.shallow}, {autoBind: true});
	}

	enqueue(message: MessageRecord): void {
		if (this.queue.some((entry) => entry.id === message.id)) {
			return;
		}

		this.queue.push(message);

		if (this.queue.length > MAX_QUEUE_LENGTH) {
			this.queue.shift();
		}
	}

	dequeue(targetId?: string): void {
		if (!targetId) {
			this.queue.shift();
			return;
		}

		if (this.queue[0]?.id === targetId) {
			this.queue.shift();
			return;
		}

		this.queue = this.queue.filter((entry) => entry.id !== targetId);
	}

	get current(): MessageRecord | undefined {
		return this.queue[0];
	}

	get count(): number {
		return this.queue.length;
	}
}

export default new MobileMentionToastStore();
