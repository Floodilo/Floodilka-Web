/*
 * SPDX-License-Identifier: AGPL-3.0-or-later
 * Copyright (C) 2020-2026 Fluxer Contributors
 * Copyright (C) 2026 Floodilka Contributors
 * Modified by Floodilka Contributors starting March 2026. See LICENSE and NOTICE.
 */

import {makeAutoObservable} from 'mobx';
import {ALL_FEATURE_FLAGS, type FeatureFlag, FeatureFlags} from '~/Constants';
import FeatureFlagOverridesStore from '~/stores/FeatureFlagOverridesStore';

type FeatureFlagGuildMap = Record<FeatureFlag, Set<string>>;

class FeatureFlagStore {
	private featureFlagGuilds: FeatureFlagGuildMap;

	constructor() {
		this.featureFlagGuilds = FeatureFlagStore.createEmptyMap();
		makeAutoObservable(this, {}, {autoBind: true});
	}

	private static createEmptyMap(): FeatureFlagGuildMap {
		const map: FeatureFlagGuildMap = {} as FeatureFlagGuildMap;
		for (const flag of ALL_FEATURE_FLAGS) {
			map[flag] = new Set();
		}
		return map;
	}

	handleConnectionOpen(featureFlags?: Record<FeatureFlag, Array<string>>): void {
		this.featureFlagGuilds = FeatureFlagStore.createEmptyMap();

		if (!featureFlags) {
			return;
		}

		for (const flag of ALL_FEATURE_FLAGS) {
			const guildIds = featureFlags[flag] ?? [];
			this.featureFlagGuilds[flag] = new Set(guildIds);
		}
	}

	private getGuildSet(flag: FeatureFlag): Set<string> {
		return this.featureFlagGuilds[flag] ?? new Set();
	}

	isFeatureEnabled(flag: FeatureFlag, guildId?: string): boolean {
		const overrideEnabled = FeatureFlagOverridesStore.getOverride(flag);
		if (overrideEnabled !== null) {
			return overrideEnabled;
		}

		if (!guildId) {
			return false;
		}

		return this.getGuildSet(flag).has(guildId);
	}

	isMessageSchedulingEnabled(guildId?: string): boolean {
		return this.isFeatureEnabled(FeatureFlags.MESSAGE_SCHEDULING, guildId);
	}

	isExpressionPacksEnabled(guildId?: string): boolean {
		return this.isFeatureEnabled(FeatureFlags.EXPRESSION_PACKS, guildId);
	}

	getGuildIdsForFlag(flag: FeatureFlag): Array<string> {
		return Array.from(this.getGuildSet(flag));
	}

	hasAccessToAnyEnabledGuild(flag: FeatureFlag, guildIds: Array<string>): boolean {
		const guildSet = this.getGuildSet(flag);
		if (guildSet.size === 0 || guildIds.length === 0) {
			return false;
		}
		return guildIds.some((guildId) => guildSet.has(guildId));
	}
}

export default new FeatureFlagStore();
