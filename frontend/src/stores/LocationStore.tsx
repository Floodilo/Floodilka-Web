/*
 * SPDX-License-Identifier: AGPL-3.0-or-later
 * Copyright (C) 2020-2026 Fluxer Contributors
 * Copyright (C) 2026 Floodilka Contributors
 * Modified by Floodilka Contributors starting March 2026. See LICENSE and NOTICE.
 */

import {makeAutoObservable} from 'mobx';
import {makePersistent} from '~/lib/MobXPersistence';

interface MobileLayoutState {
	navExpanded: boolean;
	chatExpanded: boolean;
}

class LocationStore {
	lastLocation: string | null = null;
	lastMobileLayoutState: MobileLayoutState | null = null;
	isHydrated = false;

	constructor() {
		makeAutoObservable(this, {}, {autoBind: true});
		void this.initPersistence();
	}

	private async initPersistence(): Promise<void> {
		await makePersistent(this, 'LocationStore', ['lastLocation', 'lastMobileLayoutState']);
		this.isHydrated = true;
	}

	getLastLocation(): string | null {
		return this.lastLocation;
	}

	getLastMobileLayoutState(): MobileLayoutState | null {
		return this.lastMobileLayoutState;
	}

	saveLocation(location: string): void {
		if (location && location !== this.lastLocation) {
			this.lastLocation = location;
		}
	}

	saveMobileLayoutState(mobileLayoutState: MobileLayoutState): void {
		this.lastMobileLayoutState = mobileLayoutState;
	}

	saveLocationAndMobileState(location: string, mobileLayoutState: MobileLayoutState): void {
		this.lastLocation = location;
		this.lastMobileLayoutState = mobileLayoutState;
	}

	clearLastLocation(): void {
		this.lastLocation = null;
		this.lastMobileLayoutState = null;
	}
}

export default new LocationStore();
