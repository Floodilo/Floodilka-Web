/*
 * SPDX-License-Identifier: AGPL-3.0-or-later
 * Copyright (C) 2020-2026 Fluxer Contributors
 * Copyright (C) 2026 Floodilka Contributors
 * Modified by Floodilka Contributors starting March 2026. See LICENSE and NOTICE.
 */

import {autorun, type IReactionDisposer} from 'mobx';
import * as TypingActionCreators from '~/actions/TypingActionCreators';
import AuthenticationStore from '~/stores/AuthenticationStore';
import DeveloperOptionsStore from '~/stores/DeveloperOptionsStore';
import SelectedChannelStore from '~/stores/SelectedChannelStore';

const SELF_TYPING_REFRESH_MS = 5000;

class ShowMyselfTypingHelper {
	private intervalId: NodeJS.Timeout | null = null;
	private disposer: IReactionDisposer | null = null;
	private activeChannelId: string | null = null;

	start(): void {
		if (this.disposer) {
			return;
		}

		this.disposer = autorun(() => {
			const enabled = DeveloperOptionsStore.showMyselfTyping;
			const channelId = SelectedChannelStore.currentChannelId;
			const userId = AuthenticationStore.currentUserId;
			const shouldMirror = Boolean(enabled && channelId && userId);

			if (!shouldMirror) {
				this.reset();
				return;
			}

			if (channelId !== this.activeChannelId) {
				this.activeChannelId = channelId!;
				this.trigger(channelId!, userId!);
				this.restartInterval(channelId!, userId!);
				return;
			}

			if (!this.intervalId) {
				this.restartInterval(channelId!, userId!);
			}
		});
	}

	stop(): void {
		this.reset();
		if (this.disposer) {
			this.disposer();
			this.disposer = null;
		}
	}

	private trigger(channelId: string, userId: string): void {
		TypingActionCreators.startTyping(channelId, userId);
	}

	private restartInterval(channelId: string, userId: string): void {
		if (this.intervalId) {
			clearInterval(this.intervalId);
		}

		this.intervalId = setInterval(() => this.trigger(channelId, userId), SELF_TYPING_REFRESH_MS);
	}

	private reset(): void {
		if (this.intervalId) {
			clearInterval(this.intervalId);
			this.intervalId = null;
		}
		this.activeChannelId = null;
	}
}

export const showMyselfTypingHelper = new ShowMyselfTypingHelper();
