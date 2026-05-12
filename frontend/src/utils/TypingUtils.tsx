/*
 * SPDX-License-Identifier: AGPL-3.0-or-later
 * Copyright (C) 2020-2026 Fluxer Contributors
 * Copyright (C) 2026 Floodilka Contributors
 * Modified by Floodilka Contributors starting March 2026. See LICENSE and NOTICE.
 */

import * as TypingActionCreators from '~/actions/TypingActionCreators';
import AuthenticationStore from '~/stores/AuthenticationStore';
import TypingStore from '~/stores/TypingStore';

class TypingManager {
	private currentChannelId: string | null = null;
	private nextSend: number | null = null;
	private timeoutId: NodeJS.Timeout | null = null;
	private hasStarted = false;

	typing(channelId: string): void {
		if (this.shouldReturn(channelId)) {
			return;
		}

		this.updateStateForTyping(channelId);

		if (!this.hasStarted || this.currentChannelId !== channelId) {
			const currentUserId = AuthenticationStore.currentUserId;
			if (!currentUserId) {
				return;
			}
			TypingActionCreators.startTyping(channelId, currentUserId);
			this.hasStarted = true;
		}

		if (this.timeoutId) {
			clearTimeout(this.timeoutId);
		}

		this.timeoutId = setTimeout(() => {
			this.sendTyping(channelId);
		}, 1500);

		this.nextSend = Date.now() + 10_000 * 0.8;
	}

	clear(channelId: string): void {
		if (this.currentChannelId !== channelId || !this.hasStarted) {
			return;
		}

		if (this.timeoutId) {
			clearTimeout(this.timeoutId);
			this.timeoutId = null;
		}

		const currentUserId = AuthenticationStore.currentUserId;
		if (!currentUserId) {
			return;
		}
		TypingActionCreators.stopTyping(channelId, currentUserId);

		this.resetState(channelId);
	}

	private shouldReturn(channelId: string): boolean {
		return this.currentChannelId === channelId && this.nextSend != null && this.nextSend > Date.now();
	}

	private updateStateForTyping(channelId: string): void {
		this.currentChannelId = channelId;
		const count = TypingStore.getCount(channelId);
		if (count > 5) {
			this.nextSend = Date.now() + 10_000;
		}
	}

	private sendTyping(channelId: string): void {
		TypingActionCreators.sendTyping(channelId);
		this.timeoutId = null;
	}

	private resetState(channelId: string): void {
		this.hasStarted = this.currentChannelId === channelId ? false : this.hasStarted;
		if (this.currentChannelId === channelId) {
			this.nextSend = null;
		}
	}
}

export const TypingUtils = new TypingManager();
