/*
 * SPDX-License-Identifier: AGPL-3.0-or-later
 * Copyright (C) 2020-2026 Fluxer Contributors
 * Copyright (C) 2026 Floodilka Contributors
 * Modified by Floodilka Contributors starting March 2026. See LICENSE and NOTICE.
 */

import {fetchMany, fetchOne, upsertOne} from '~/database/Cassandra';
import type {InstanceConfigurationRow} from '~/database/CassandraTypes';
import {InstanceConfiguration} from '~/Tables';

const FETCH_CONFIG_QUERY = InstanceConfiguration.selectCql({
	where: InstanceConfiguration.where.eq('key'),
	limit: 1,
});

const FETCH_ALL_CONFIG_QUERY = InstanceConfiguration.selectCql();

export interface InstanceConfig {
	registrationAlertsWebhookUrl: string | null;
	systemAlertsWebhookUrl: string | null;
}

export class InstanceConfigRepository {
	async getConfig(key: string): Promise<string | null> {
		const row = await fetchOne<InstanceConfigurationRow>(FETCH_CONFIG_QUERY, {key});
		return row?.value ?? null;
	}

	async getAllConfigs(): Promise<Map<string, string>> {
		const rows = await fetchMany<InstanceConfigurationRow>(FETCH_ALL_CONFIG_QUERY, {});
		const configs = new Map<string, string>();
		for (const row of rows) {
			if (row.value != null) {
				configs.set(row.key, row.value);
			}
		}
		return configs;
	}

	async setConfig(key: string, value: string): Promise<void> {
		await upsertOne(
			InstanceConfiguration.upsertAll({
				key,
				value,
				updated_at: new Date(),
			}),
		);
	}

	async getInstanceConfig(): Promise<InstanceConfig> {
		const configs = await this.getAllConfigs();

		return {
			registrationAlertsWebhookUrl: configs.get('registration_alerts_webhook_url') ?? null,
			systemAlertsWebhookUrl: configs.get('system_alerts_webhook_url') ?? null,
		};
	}

	async setRegistrationAlertsWebhookUrl(url: string | null): Promise<void> {
		if (url) {
			await this.setConfig('registration_alerts_webhook_url', url);
		} else {
			await this.setConfig('registration_alerts_webhook_url', '');
		}
	}

	async setSystemAlertsWebhookUrl(url: string | null): Promise<void> {
		if (url) {
			await this.setConfig('system_alerts_webhook_url', url);
		} else {
			await this.setConfig('system_alerts_webhook_url', '');
		}
	}

}
