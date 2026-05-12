/*
 * SPDX-License-Identifier: AGPL-3.0-or-later
 * Copyright (C) 2020-2026 Fluxer Contributors
 * Copyright (C) 2026 Floodilka Contributors
 * Modified by Floodilka Contributors starting March 2026. See LICENSE and NOTICE.
 */

import type {Redis} from 'ioredis';
import type {UserID} from '~/BrandedTypes';
import {Config} from '~/Config';
import {UserFlags} from '~/Constants';
import type {User} from '~/models/User';

export class UserDeletionEligibilityService {
	private readonly INACTIVITY_WARNING_TTL_DAYS = 30;
	private readonly INACTIVITY_WARNING_PREFIX = 'inactivity_warning_sent';

	constructor(private redis: Redis) {}

	async isEligibleForInactivityDeletion(user: User): Promise<boolean> {
		if (user.isBot) {
			return false;
		}

		if (user.isSystem) {
			return false;
		}

		// Check: User must not have APP_STORE_REVIEWER flag set
		if ((user.flags & UserFlags.APP_STORE_REVIEWER) !== 0n) {
			return false;
		}

		if (user.pendingDeletionAt !== null) {
			return false;
		}

		if (user.lastActiveAt === null) {
			return false;
		}

		const inactivityThresholdMs = this.getInactivityThresholdMs();
		const timeSinceLastActiveMs = Date.now() - user.lastActiveAt.getTime();

		if (timeSinceLastActiveMs < inactivityThresholdMs) {
			return false;
		}

		return true;
	}

	async isEligibleForWarningEmail(user: User): Promise<boolean> {
		const isEligibleForDeletion = await this.isEligibleForInactivityDeletion(user);
		if (!isEligibleForDeletion) {
			return false;
		}

		const alreadySentWarning = await this.hasWarningSent(user.id);
		if (alreadySentWarning) {
			return false;
		}

		return true;
	}

	async markWarningSent(userId: UserID): Promise<void> {
		const key = this.getWarningRedisKey(userId);
		const ttlSeconds = (this.INACTIVITY_WARNING_TTL_DAYS + 5) * 24 * 60 * 60;
		const timestamp = Date.now().toString();

		await this.redis.setex(key, ttlSeconds, timestamp);
	}

	async hasWarningSent(userId: UserID): Promise<boolean> {
		const key = this.getWarningRedisKey(userId);
		const exists = await this.redis.exists(key);
		return exists === 1;
	}

	async getWarningSentTimestamp(userId: UserID): Promise<number | null> {
		const key = this.getWarningRedisKey(userId);
		const value = await this.redis.get(key);
		if (!value) {
			return null;
		}
		const timestamp = parseInt(value, 10);
		return Number.isNaN(timestamp) ? null : timestamp;
	}

	async hasWarningGracePeriodExpired(userId: UserID): Promise<boolean> {
		const timestamp = await this.getWarningSentTimestamp(userId);
		if (timestamp === null) {
			return false;
		}

		const timeSinceWarningMs = Date.now() - timestamp;
		const gracePeriodMs = this.INACTIVITY_WARNING_TTL_DAYS * 24 * 60 * 60 * 1000;

		return timeSinceWarningMs >= gracePeriodMs;
	}

	private getInactivityThresholdMs(): number {
		const thresholdDays = Config.inactivityDeletionThresholdDays ?? 365 * 2;
		return thresholdDays * 24 * 60 * 60 * 1000;
	}

	private getWarningRedisKey(userId: UserID): string {
		return `${this.INACTIVITY_WARNING_PREFIX}:${userId}`;
	}
}
