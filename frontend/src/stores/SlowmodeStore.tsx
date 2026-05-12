/*
 * SPDX-License-Identifier: AGPL-3.0-or-later
 * Copyright (C) 2020-2026 Fluxer Contributors
 * Copyright (C) 2026 Floodilka Contributors
 * Modified by Floodilka Contributors starting March 2026. See LICENSE and NOTICE.
 */

import {makeAutoObservable} from 'mobx';
import {makePersistent} from '~/lib/MobXPersistence';

class SlowmodeStore {
	lastSendTimestamps: Record<string, number> = {};

	constructor() {
		makeAutoObservable(this, {}, {autoBind: true});
		void this.initPersistence();
	}

	private async initPersistence(): Promise<void> {
		await makePersistent(this, 'SlowmodeStore', ['lastSendTimestamps']);
	}

	recordMessageSend(channelId: string): void {
		this.lastSendTimestamps = {
			...this.lastSendTimestamps,
			[channelId]: Date.now(),
		};
	}

	updateSlowmodeTimestamp(channelId: string, timestamp: number): void {
		if (this.lastSendTimestamps[channelId] === timestamp) {
			return;
		}

		this.lastSendTimestamps = {
			...this.lastSendTimestamps,
			[channelId]: timestamp,
		};
	}

	deleteChannel(channelId: string): void {
		if (!this.lastSendTimestamps[channelId]) {
			return;
		}

		const {[channelId]: _, ...remainingTimestamps} = this.lastSendTimestamps;
		this.lastSendTimestamps = remainingTimestamps;
	}

	getLastSendTimestamp(channelId: string): number | null {
		return this.lastSendTimestamps[channelId] ?? null;
	}

	getSlowmodeRemaining(channelId: string, rateLimitPerUser: number): number {
		const lastSentTime = this.lastSendTimestamps[channelId];
		if (!lastSentTime) return 0;

		const timeSinceLastMessage = Date.now() - lastSentTime;
		return Math.max(0, rateLimitPerUser * 1000 - timeSinceLastMessage);
	}
}

export default new SlowmodeStore();
