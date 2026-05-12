/*
 * SPDX-License-Identifier: AGPL-3.0-or-later
 * Copyright (C) 2020-2026 Fluxer Contributors
 * Copyright (C) 2026 Floodilka Contributors
 * Modified by Floodilka Contributors starting March 2026. See LICENSE and NOTICE.
 */

import {Queue, type ConnectionOptions} from 'bullmq';
import {Redis} from 'ioredis';
import {buildBullMQConnectionOptions, createRedisClient} from '~/infrastructure/RedisClientFactory';
import {Logger} from '~/Logger';

export const FLOODILKA_QUEUE_NAME = 'floodilka';

export const bullmqConnection: ConnectionOptions = buildBullMQConnectionOptions();

let queueSingleton: Queue | null = null;

export function getQueue(): Queue {
	if (!queueSingleton) {
		queueSingleton = new Queue(FLOODILKA_QUEUE_NAME, {
			connection: bullmqConnection,
			defaultJobOptions: {
				removeOnComplete: {
					age: 60 * 60,
					count: 1000,
				},
				removeOnFail: {
					age: 24 * 60 * 60,
					count: 5000,
				},
			},
		});
		queueSingleton.on('error', (err) => {
			Logger.error({err}, 'BullMQ Queue error');
		});
	}
	return queueSingleton;
}

export async function shutdownQueue(): Promise<void> {
	if (queueSingleton) {
		await queueSingleton.close();
		queueSingleton = null;
	}
}

export function createBullMQRedis(): Redis {
	return createRedisClient({
		maxRetriesPerRequest: null,
		enableReadyCheck: false,
	});
}
