/*
 * SPDX-License-Identifier: AGPL-3.0-or-later
 * Copyright (C) 2020-2026 Fluxer Contributors
 * Copyright (C) 2026 Floodilka Contributors
 * Modified by Floodilka Contributors starting March 2026. See LICENSE and NOTICE.
 */

export abstract class ICacheService {
	abstract get<T>(key: string): Promise<T | null>;
	abstract set<T>(key: string, value: T, ttlSeconds?: number): Promise<void>;
	abstract delete(key: string): Promise<void>;
	abstract getAndDelete<T>(key: string): Promise<T | null>;
	abstract exists(key: string): Promise<boolean>;
	abstract expire(key: string, ttlSeconds: number): Promise<void>;
	abstract ttl(key: string): Promise<number>;
	abstract mget<T>(keys: Array<string>): Promise<Array<T | null>>;
	abstract mset<T>(entries: Array<{key: string; value: T; ttlSeconds?: number}>): Promise<void>;
	abstract deletePattern(pattern: string): Promise<number>;
	abstract acquireLock(key: string, ttlSeconds: number): Promise<string | null>;
	abstract releaseLock(key: string, token: string): Promise<boolean>;
	abstract getAndRenewTtl<T>(key: string, newTtlSeconds: number): Promise<T | null>;
	abstract publish(channel: string, message: string): Promise<void>;
}
