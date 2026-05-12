/*
 * SPDX-License-Identifier: AGPL-3.0-or-later
 * Copyright (C) 2020-2026 Fluxer Contributors
 * Copyright (C) 2026 Floodilka Contributors
 * Modified by Floodilka Contributors starting March 2026. See LICENSE and NOTICE.
 */

import {Redis, type RedisOptions} from 'ioredis';
import {Config} from '~/Config';
import {Logger} from '~/Logger';

function buildOptions(extra: RedisOptions = {}): RedisOptions {
	return {
		sentinels: Config.redis.sentinels,
		name: Config.redis.sentinelMasterName,
		password: Config.redis.password,
		sentinelPassword: Config.redis.password,
		...extra,
	};
}

function attachErrorLogger(client: Redis): Redis {
	client.on('error', (err) => {
		Logger.warn({err: err.message}, 'ioredis client error');
	});
	return client;
}

export function createRedisClient(extra: RedisOptions = {}): Redis {
	return attachErrorLogger(new Redis(buildOptions(extra)));
}

let healthClient: Redis | null = null;

export async function pingRedis(): Promise<void> {
	if (!healthClient) {
		healthClient = createRedisClient();
	}
	await healthClient.ping();
}

export async function shutdownHealthClient(): Promise<void> {
	if (healthClient) {
		await healthClient.quit();
		healthClient = null;
	}
}

export function buildBullMQConnectionOptions(): RedisOptions {
	return buildOptions({
		maxRetriesPerRequest: null,
		enableReadyCheck: false,
	});
}
