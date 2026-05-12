/*
 * SPDX-License-Identifier: AGPL-3.0-or-later
 * Copyright (C) 2020-2026 Fluxer Contributors
 * Copyright (C) 2026 Floodilka Contributors
 * Modified by Floodilka Contributors starting March 2026. See LICENSE and NOTICE.
 */

export interface RateLimitResult {
	allowed: boolean;
	limit: number;
	remaining: number;
	resetTime: Date;
	retryAfter?: number;
	retryAfterDecimal?: number;
	global?: boolean;
}

export interface RateLimitConfig {
	maxAttempts: number;
	windowMs: number;
	identifier: string;
}

export interface BucketConfig {
	limit: number;
	windowMs: number;
	exemptFromGlobal?: boolean;
}

export interface PeekLimitConfig {
	identifier: string;
	maxAttempts: number;
}

export interface IRateLimitService {
	checkLimit(config: RateLimitConfig): Promise<RateLimitResult>;
	peekLimit(config: PeekLimitConfig): Promise<RateLimitResult>;
	checkBucketLimit(bucket: string, config: BucketConfig): Promise<RateLimitResult>;
	checkGlobalLimit(identifier: string, limit: number): Promise<RateLimitResult>;
	resetLimit(identifier: string): Promise<void>;
	getRemainingAttempts(identifier: string, windowMs: number): Promise<number>;
	getResetTime(identifier: string, windowMs: number): Promise<Date>;
}
