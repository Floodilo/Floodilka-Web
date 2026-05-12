/*
 * SPDX-License-Identifier: AGPL-3.0-or-later
 * Copyright (C) 2020-2026 Fluxer Contributors
 * Copyright (C) 2026 Floodilka Contributors
 * Modified by Floodilka Contributors starting March 2026. See LICENSE and NOTICE.
 */

import {createMiddleware} from 'hono/factory';
import type {Redis} from 'ioredis';
import type {HonoEnv} from '~/App';
import {AdminRepository} from '~/admin/AdminRepository';
import {IP_BAN_REFRESH_CHANNEL} from '~/constants/IpBan';
import {IpBannedError} from '~/Errors';
import {Logger} from '~/Logger';
import {type IpFamily, parseIpBanEntry, tryParseSingleIp} from '~/utils/IpRangeUtils';
import {extractClientIp} from '~/utils/IpUtils';

type FamilyMap<T> = Record<IpFamily, Map<string, T>>;

interface SingleCacheEntry {
	value: bigint;
	count: number;
}

interface RangeCacheEntry {
	start: bigint;
	end: bigint;
	count: number;
}

class IpBanCache {
	private singleIpBans: FamilyMap<SingleCacheEntry>;
	private rangeIpBans: FamilyMap<RangeCacheEntry>;
	private isInitialized = false;
	private adminRepository = new AdminRepository();
	private consecutiveFailures = 0;
	private maxConsecutiveFailures = 5;
	private redisSubscriber: Redis | null = null;
	private subscriberInitialized = false;
	private messageHandler: ((channel: string) => void) | null = null;

	constructor() {
		this.singleIpBans = this.createFamilyMaps();
		this.rangeIpBans = this.createFamilyMaps();
	}

	setRefreshSubscriber(subscriber: Redis | null): void {
		this.redisSubscriber = subscriber;
	}

	async initialize(): Promise<void> {
		if (this.isInitialized) return;

		await this.refresh();
		this.isInitialized = true;
		this.setupSubscriber();
	}

	private setupSubscriber(): void {
		if (this.subscriberInitialized || !this.redisSubscriber) {
			return;
		}

		const subscriber = this.redisSubscriber;
		this.messageHandler = (channel) => {
			if (channel === IP_BAN_REFRESH_CHANNEL) {
				this.refresh().catch((err) => {
					this.consecutiveFailures++;
					const message = err instanceof Error ? err.message : String(err);
					if (this.consecutiveFailures >= this.maxConsecutiveFailures) {
						Logger.error({error: message}, 'Failed to refresh IP ban cache after notification');
					} else {
						Logger.warn({error: message}, 'Failed to refresh IP ban cache after notification');
					}
				});
			}
		};

		subscriber
			.subscribe(IP_BAN_REFRESH_CHANNEL)
			.then(() => {
				subscriber.on('message', this.messageHandler!);
			})
			.catch((error) => {
				Logger.error({error}, 'Failed to subscribe to IP ban refresh channel');
			});

		this.subscriberInitialized = true;
	}

	shutdown(): void {
		if (this.redisSubscriber && this.messageHandler) {
			this.redisSubscriber.removeListener('message', this.messageHandler);
			this.redisSubscriber.disconnect();
			this.messageHandler = null;
		}
	}

	async refresh(): Promise<void> {
		const ips = await this.adminRepository.listBannedIps();
		this.resetCaches();
		for (const ip of ips) {
			this.addEntry(ip);
		}
		this.consecutiveFailures = 0;
	}

	isBanned(ip: string): boolean {
		const parsed = tryParseSingleIp(ip);
		if (!parsed) return false;

		const singleMap = this.singleIpBans[parsed.family];
		if (singleMap.has(parsed.canonical)) {
			return true;
		}

		const rangeMap = this.rangeIpBans[parsed.family];
		for (const range of rangeMap.values()) {
			if (parsed.value >= range.start && parsed.value <= range.end) {
				return true;
			}
		}

		return false;
	}

	ban(ip: string): void {
		this.addEntry(ip);
	}

	unban(ip: string): void {
		this.removeEntry(ip);
	}

	private resetCaches(): void {
		this.singleIpBans = this.createFamilyMaps();
		this.rangeIpBans = this.createFamilyMaps();
	}

	private createFamilyMaps<T>(): FamilyMap<T> {
		return {
			ipv4: new Map(),
			ipv6: new Map(),
		};
	}

	private addEntry(value: string): void {
		const parsed = parseIpBanEntry(value);
		if (!parsed) {
			Logger.warn({value}, 'Skipping invalid IP ban entry');
			return;
		}

		if (parsed.type === 'single') {
			const map = this.singleIpBans[parsed.family];
			const existing = map.get(parsed.canonical);
			if (existing) {
				existing.count += 1;
			} else {
				map.set(parsed.canonical, {value: parsed.value, count: 1});
			}
		} else {
			const map = this.rangeIpBans[parsed.family];
			const existing = map.get(parsed.canonical);
			if (existing) {
				existing.count += 1;
			} else {
				map.set(parsed.canonical, {start: parsed.start, end: parsed.end, count: 1});
			}
		}
	}

	private removeEntry(value: string): void {
		const parsed = parseIpBanEntry(value);
		if (!parsed) return;

		if (parsed.type === 'single') {
			const map = this.singleIpBans[parsed.family];
			const existing = map.get(parsed.canonical);
			if (!existing) return;
			if (existing.count <= 1) {
				map.delete(parsed.canonical);
			} else {
				existing.count -= 1;
			}
		} else {
			const map = this.rangeIpBans[parsed.family];
			const existing = map.get(parsed.canonical);
			if (!existing) return;
			if (existing.count <= 1) {
				map.delete(parsed.canonical);
			} else {
				existing.count -= 1;
			}
		}
	}
}

export const ipBanCache = new IpBanCache();

export const IpBanMiddleware = createMiddleware<HonoEnv>(async (ctx, next) => {
	const clientIp = extractClientIp(ctx.req.raw);

	if (clientIp && ipBanCache.isBanned(clientIp)) {
		throw new IpBannedError();
	}

	await next();
});
