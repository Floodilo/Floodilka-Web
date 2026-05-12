/*
 * SPDX-License-Identifier: AGPL-3.0-or-later
 * Copyright (C) 2020-2026 Fluxer Contributors
 * Copyright (C) 2026 Floodilka Contributors
 * Modified by Floodilka Contributors starting March 2026. See LICENSE and NOTICE.
 */

import {makeAutoObservable} from 'mobx';
import {makePersistent} from '~/lib/MobXPersistence';
import DeveloperOptionsStore from '~/stores/DeveloperOptionsStore';
import UserStore from '~/stores/UserStore';

export enum NSFWGateReason {
	NONE = 0,
	AGE_RESTRICTED = 2,
	CONSENT_REQUIRED = 3,
}

class GuildNSFWAgreeStore {
	agreedChannelIds: Array<string> = [];

	constructor() {
		makeAutoObservable(this, {}, {autoBind: true});
		void this.initPersistence();
	}

	private async initPersistence(): Promise<void> {
		await makePersistent(this, 'GuildNSFWAgreeStore', ['agreedChannelIds']);
	}

	agreeToChannel(channelId: string): void {
		if (!this.agreedChannelIds.includes(channelId)) {
			this.agreedChannelIds.push(channelId);
		}
	}

	reset(): void {
		this.agreedChannelIds = [];
	}

	hasAgreedToChannel(channelId: string): boolean {
		return this.agreedChannelIds.includes(channelId);
	}

	getGateReason(channelId: string): NSFWGateReason {
		const mockReason = DeveloperOptionsStore.mockNSFWGateReason;
		if (mockReason !== 'none') {
			switch (mockReason) {
				case 'age_restricted':
					return NSFWGateReason.AGE_RESTRICTED;
				case 'consent_required':
					return NSFWGateReason.CONSENT_REQUIRED;
			}
		}

		const currentUser = UserStore.getCurrentUser();
		if (currentUser && !currentUser.nsfwAllowed) {
			return NSFWGateReason.AGE_RESTRICTED;
		}

		if (!this.hasAgreedToChannel(channelId)) {
			return NSFWGateReason.CONSENT_REQUIRED;
		}

		return NSFWGateReason.NONE;
	}

	shouldShowGate(channelId: string): boolean {
		return this.getGateReason(channelId) !== NSFWGateReason.NONE;
	}
}

export default new GuildNSFWAgreeStore();
