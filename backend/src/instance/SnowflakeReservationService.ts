/*
 * SPDX-License-Identifier: AGPL-3.0-or-later
 * Copyright (C) 2020-2026 Fluxer Contributors
 * Copyright (C) 2026 Floodilka Contributors
 * Modified by Floodilka Contributors starting March 2026. See LICENSE and NOTICE.
 */

import type {Redis} from 'ioredis';
import {SNOWFLAKE_RESERVATION_REFRESH_CHANNEL} from '~/constants/InstanceConfig';
import {Logger} from '~/Logger';
import type {SnowflakeReservationConfig, SnowflakeReservationRepository} from './SnowflakeReservationRepository';

export class SnowflakeReservationService {
	private reservations = new Map<string, bigint>();
	private initialized = false;
	private reloadPromise: Promise<void> | null = null;
	private messageHandler: ((channel: string) => void) | null = null;

	constructor(
		private repository: SnowflakeReservationRepository,
		private redisSubscriber: Redis | null,
	) {}

	async initialize(): Promise<void> {
		if (this.initialized) {
			return;
		}

		await this.reload();
		this.initialized = true;

		if (this.redisSubscriber) {
			try {
				await this.redisSubscriber.subscribe(SNOWFLAKE_RESERVATION_REFRESH_CHANNEL);
				this.messageHandler = (channel) => {
					if (channel === SNOWFLAKE_RESERVATION_REFRESH_CHANNEL) {
						this.reload().catch((error) => {
							Logger.error({error}, 'Failed to reload snowflake reservations');
						});
					}
				};
				this.redisSubscriber.on('message', this.messageHandler);
			} catch (error) {
				Logger.error({error}, 'Failed to subscribe to snowflake reservation refresh channel');
			}
		}
	}

	shutdown(): void {
		if (this.redisSubscriber && this.messageHandler) {
			this.redisSubscriber.removeListener('message', this.messageHandler);
			this.redisSubscriber.disconnect();
			this.messageHandler = null;
		}
	}

	async reload(): Promise<void> {
		if (this.reloadPromise) {
			return this.reloadPromise;
		}

		this.reloadPromise = (async () => {
			const entries = await this.repository.listReservations();
			this.reservations = this.buildLookup(entries);
		})()
			.catch((error) => {
				Logger.error({error}, 'Failed to reload snowflake reservations from the database');
				throw error;
			})
			.finally(() => {
				this.reloadPromise = null;
			});

		return this.reloadPromise;
	}

	getReservedSnowflake(emailKey: string | null): bigint | null {
		if (!emailKey) {
			return null;
		}
		return this.reservations.get(emailKey) ?? null;
	}

	private buildLookup(entries: Array<SnowflakeReservationConfig>): Map<string, bigint> {
		const lookup = new Map<string, bigint>();
		for (const entry of entries) {
			lookup.set(entry.emailKey, entry.snowflake);
		}
		return lookup;
	}
}
