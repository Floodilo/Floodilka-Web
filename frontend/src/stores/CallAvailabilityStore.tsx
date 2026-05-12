/*
 * SPDX-License-Identifier: AGPL-3.0-or-later
 * Copyright (C) 2020-2026 Fluxer Contributors
 * Copyright (C) 2026 Floodilka Contributors
 * Modified by Floodilka Contributors starting March 2026. See LICENSE and NOTICE.
 */

import {makeAutoObservable, observable} from 'mobx';

class CallAvailabilityStore {
	unavailableCalls: Set<string> = observable.set();

	constructor() {
		makeAutoObservable(
			this,
			{
				unavailableCalls: false,
			},
			{autoBind: true},
		);
	}

	setCallAvailable(channelId: string): void {
		if (this.unavailableCalls.has(channelId)) {
			this.unavailableCalls.delete(channelId);
		}
	}

	setCallUnavailable(channelId: string): void {
		if (!this.unavailableCalls.has(channelId)) {
			this.unavailableCalls.add(channelId);
		}
	}

	handleCallAvailability(channelId: string, unavailable = false): void {
		if (unavailable) {
			this.setCallUnavailable(channelId);
		} else {
			this.setCallAvailable(channelId);
		}
	}

	get totalUnavailableCalls(): number {
		return this.unavailableCalls.size;
	}

	isCallUnavailable(channelId: string): boolean {
		return this.unavailableCalls.has(channelId);
	}
}

export default new CallAvailabilityStore();
