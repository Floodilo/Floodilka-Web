/*
 * SPDX-License-Identifier: AGPL-3.0-or-later
 * Copyright (C) 2020-2026 Fluxer Contributors
 * Copyright (C) 2026 Floodilka Contributors
 * Modified by Floodilka Contributors starting March 2026. See LICENSE and NOTICE.
 */

import {ALL_FEATURE_FLAGS, FEATURE_FLAG_KEY_PREFIX, type FeatureFlag} from '~/constants/FeatureFlags';
import {fetchMany, upsertOne} from '~/database/Cassandra';
import type {InstanceConfigurationRow} from '~/database/CassandraTypes';
import {InstanceConfiguration} from '~/Tables';

const FETCH_ALL_CONFIG_QUERY = InstanceConfiguration.selectCql();

export class FeatureFlagRepository {
	async getFeatureFlag(flag: FeatureFlag): Promise<Set<string>> {
		const allConfigs = await this.getAllFeatureFlags();
		return allConfigs.get(flag) ?? new Set();
	}

	async setFeatureFlag(flag: FeatureFlag, guildIds: Set<string>): Promise<void> {
		const key = `${FEATURE_FLAG_KEY_PREFIX}${flag}`;
		const value = Array.from(guildIds).join(',');
		await upsertOne(
			InstanceConfiguration.upsertAll({
				key,
				value,
				updated_at: new Date(),
			}),
		);
	}

	async getAllFeatureFlags(): Promise<Map<FeatureFlag, Set<string>>> {
		const rows = await fetchMany<InstanceConfigurationRow>(FETCH_ALL_CONFIG_QUERY, {});
		const result = new Map<FeatureFlag, Set<string>>();

		for (const flag of ALL_FEATURE_FLAGS) {
			result.set(flag, new Set());
		}

		for (const row of rows) {
			if (row.key.startsWith(FEATURE_FLAG_KEY_PREFIX) && row.value != null) {
				const flagName = row.key.slice(FEATURE_FLAG_KEY_PREFIX.length) as FeatureFlag;
				if (ALL_FEATURE_FLAGS.includes(flagName)) {
					const guildIds = row.value
						.split(',')
						.map((id) => id.trim())
						.filter((id) => id.length > 0);
					result.set(flagName, new Set(guildIds));
				}
			}
		}

		return result;
	}
}
