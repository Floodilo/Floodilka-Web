/*
 * SPDX-License-Identifier: AGPL-3.0-or-later
 * Copyright (C) 2020-2026 Fluxer Contributors
 * Copyright (C) 2026 Floodilka Contributors
 * Modified by Floodilka Contributors starting March 2026. See LICENSE and NOTICE.
 */

import {SNOWFLAKE_RESERVATION_KEY_PREFIX} from '~/constants/InstanceConfig';
import {deleteOneOrMany, fetchMany, upsertOne} from '~/database/Cassandra';
import type {InstanceConfigurationRow} from '~/database/CassandraTypes';
import {Logger} from '~/Logger';
import {InstanceConfiguration} from '~/Tables';

const FETCH_ALL_CONFIG_QUERY = InstanceConfiguration.selectCql();

export interface SnowflakeReservationConfig {
	emailKey: string;
	snowflake: bigint;
	updatedAt: Date | null;
}

export class SnowflakeReservationRepository {
	async listReservations(): Promise<Array<SnowflakeReservationConfig>> {
		const rows = await fetchMany<InstanceConfigurationRow>(FETCH_ALL_CONFIG_QUERY, {});
		const reservations: Array<SnowflakeReservationConfig> = [];

		for (const row of rows) {
			if (!row.key.startsWith(SNOWFLAKE_RESERVATION_KEY_PREFIX) || row.value == null || row.value.trim().length === 0) {
				continue;
			}

			const emailKey = row.key.slice(SNOWFLAKE_RESERVATION_KEY_PREFIX.length);
			if (!emailKey) continue;

			const snowflakeString = row.value.trim();
			try {
				const snowflake = BigInt(snowflakeString);
				reservations.push({
					emailKey,
					snowflake,
					updatedAt: row.updated_at ?? null,
				});
			} catch (error) {
				Logger.warn({key: row.key, value: row.value, error}, 'Skipping invalid snowflake reservation value');
			}
		}

		return reservations;
	}

	async setReservation(emailKey: string, snowflake: bigint): Promise<void> {
		await upsertOne(
			InstanceConfiguration.upsertAll({
				key: `${SNOWFLAKE_RESERVATION_KEY_PREFIX}${emailKey}`,
				value: snowflake.toString(),
				updated_at: new Date(),
			}),
		);
	}

	async deleteReservation(emailKey: string): Promise<void> {
		await deleteOneOrMany(
			InstanceConfiguration.deleteCql({
				where: InstanceConfiguration.where.eq('key'),
			}),
			{key: `${SNOWFLAKE_RESERVATION_KEY_PREFIX}${emailKey}`},
		);
	}
}
