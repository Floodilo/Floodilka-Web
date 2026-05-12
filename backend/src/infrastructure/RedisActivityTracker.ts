/*
 * SPDX-License-Identifier: AGPL-3.0-or-later
 * Copyright (C) 2020-2026 Fluxer Contributors
 * Copyright (C) 2026 Floodilka Contributors
 * Modified by Floodilka Contributors starting March 2026. See LICENSE and NOTICE.
 */

import type {Redis} from 'ioredis';
import type {UserID} from '~/BrandedTypes';
import {Logger} from '~/Logger';
import {UserRepository} from '~/user/UserRepository';
import type {ClientPlatform} from '~/utils/PlatformUtils';

const TTL_SECONDS = 90 * 24 * 60 * 60;
const STATE_VERSION_KEY = 'activity_tracker:state_version';
const STATE_VERSION_TTL_SECONDS = 24 * 60 * 60;
const REBUILD_BATCH_SIZE = 100;

export class RedisActivityTracker {
	private redis: Redis;

	constructor(redis: Redis) {
		this.redis = redis;
	}

	private getActivityKey(userId: UserID): string {
		return `user_activity:${userId}`;
	}

	async updateActivity(userId: UserID, timestamp: Date): Promise<void> {
		const key = this.getActivityKey(userId);
		const value = timestamp.getTime().toString();
		await this.redis.setex(key, TTL_SECONDS, value);
	}

	async trackRegistration(userId: UserID): Promise<void> {
		const dateStr = new Date().toISOString().slice(0, 10);
		const key = `registrations:${dateStr}`;
		await this.redis.sadd(key, userId.toString());
		await this.redis.expire(key, 31 * 24 * 60 * 60);
	}

	async trackDailyActiveIfNew(userId: UserID, platform: ClientPlatform): Promise<boolean> {
		const dateStr = new Date().toISOString().slice(0, 10);
		const key = `dau:${dateStr}:${userId}`;
		const result = await this.redis.set(key, platform, 'EX', 90000, 'NX');
		return result !== null;
	}

	async getActivity(userId: UserID): Promise<Date | null> {
		const key = this.getActivityKey(userId);
		const value = await this.redis.get(key);

		if (!value) {
			return null;
		}

		const timestamp = parseInt(value, 10);
		if (Number.isNaN(timestamp)) {
			return null;
		}

		return new Date(timestamp);
	}

	async needsRebuild(): Promise<boolean> {
		const exists = await this.redis.exists(STATE_VERSION_KEY);
		if (exists === 0) {
			return true;
		}

		const ttl = await this.redis.ttl(STATE_VERSION_KEY);

		if (ttl < 0) {
			return true;
		}

		const age = STATE_VERSION_TTL_SECONDS - ttl;
		return age > STATE_VERSION_TTL_SECONDS;
	}

	async rebuildActivities(): Promise<void> {
		Logger.info('Starting activity tracker rebuild from Cassandra');

		const userRepository = new UserRepository();

		try {
			const redisBatchSize = 1000;
			let processedCount = 0;
			let usersWithActivity = 0;
			let pipeline = this.redis.pipeline();
			let pipelineCount = 0;
			let lastUserId: UserID | undefined;

			while (true) {
				const users = await userRepository.listAllUsersPaginated(REBUILD_BATCH_SIZE, lastUserId);

				if (users.length === 0) {
					break;
				}

				for (const user of users) {
					if (user.lastActiveAt) {
						const key = this.getActivityKey(user.id);
						const value = user.lastActiveAt.getTime().toString();
						pipeline.setex(key, TTL_SECONDS, value);
						pipelineCount++;
						usersWithActivity++;

						if (pipelineCount >= redisBatchSize) {
							await pipeline.exec();
							pipeline = this.redis.pipeline();
							pipelineCount = 0;
						}
					}

					processedCount++;
				}

				if (processedCount % 10000 === 0) {
					Logger.info({processedCount, usersWithActivity}, 'Activity tracker rebuild progress');
				}

				lastUserId = users[users.length - 1].id;
			}

			if (pipelineCount > 0) {
				await pipeline.exec();
			}

			await this.redis.setex(STATE_VERSION_KEY, STATE_VERSION_TTL_SECONDS, Date.now().toString());

			Logger.info({processedCount, usersWithActivity}, 'Activity tracker rebuild completed');
		} catch (error) {
			Logger.error({error}, 'Activity tracker rebuild failed');
			throw error;
		}
	}
}
