/*
 * SPDX-License-Identifier: AGPL-3.0-or-later
 * Copyright (C) 2020-2026 Fluxer Contributors
 * Copyright (C) 2026 Floodilka Contributors
 * Modified by Floodilka Contributors starting March 2026. See LICENSE and NOTICE.
 */

import {makeAutoObservable} from 'mobx';
import {IS_DEV} from '~/lib/env';
import {makePersistent} from '~/lib/MobXPersistence';
import UserStore from '~/stores/UserStore';

const UNLOCK_TAP_THRESHOLD = 7;
const MAX_TAP_INTERVAL_MS = 1200;

class DeveloperModeStore {
	manuallyEnabled = false;

	private tapCount = 0;
	private lastTapAt: number | null = null;

	constructor() {
		makeAutoObservable(this, {}, {autoBind: true});
		this.initPersistence();
	}

	private async initPersistence(): Promise<void> {
		await makePersistent(this, 'DeveloperModeStore', ['manuallyEnabled']);
	}

	get isDeveloper(): boolean {
		if (IS_DEV) return true;

		if (UserStore.currentUser?.isStaff?.()) return true;

		return this.manuallyEnabled;
	}

	private resetTaps(): void {
		this.tapCount = 0;
		this.lastTapAt = null;
	}

	registerBuildTap(): boolean {
		if (this.isDeveloper) {
			this.resetTaps();
			return false;
		}

		const now = Date.now();
		if (this.lastTapAt && now - this.lastTapAt <= MAX_TAP_INTERVAL_MS) {
			this.tapCount += 1;
		} else {
			this.tapCount = 1;
		}
		this.lastTapAt = now;

		if (this.tapCount >= UNLOCK_TAP_THRESHOLD) {
			this.manuallyEnabled = true;
			this.resetTaps();
			return true;
		}

		return false;
	}
}

export default new DeveloperModeStore();
