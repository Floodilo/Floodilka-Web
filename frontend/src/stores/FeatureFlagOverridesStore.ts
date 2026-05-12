/*
 * SPDX-License-Identifier: AGPL-3.0-or-later
 * Copyright (C) 2020-2026 Fluxer Contributors
 * Copyright (C) 2026 Floodilka Contributors
 * Modified by Floodilka Contributors starting March 2026. See LICENSE and NOTICE.
 */

import {makeAutoObservable} from 'mobx';
import type {FeatureFlag} from '~/Constants';
import {makePersistent} from '~/lib/MobXPersistence';

type FeatureFlagOverrides = Partial<Record<FeatureFlag, boolean>>;

class FeatureFlagOverridesStore {
	overrides: FeatureFlagOverrides = {};

	constructor() {
		makeAutoObservable(this, {}, {autoBind: true});
		void this.initPersistence();
	}

	private async initPersistence(): Promise<void> {
		await makePersistent(this, 'FeatureFlagOverridesStore', ['overrides']);
	}

	getOverride(flag: FeatureFlag): boolean | null {
		if (Object.hasOwn(this.overrides, flag)) {
			return this.overrides[flag] ?? null;
		}
		return null;
	}

	setOverride(flag: FeatureFlag, value: boolean | null): void {
		const next = {...this.overrides};

		if (value === null) {
			delete next[flag];
		} else {
			next[flag] = value;
		}

		this.overrides = next;
	}
}

export default new FeatureFlagOverridesStore();
