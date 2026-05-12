/*
 * SPDX-License-Identifier: AGPL-3.0-or-later
 * Copyright (C) 2020-2026 Fluxer Contributors
 * Copyright (C) 2026 Floodilka Contributors
 * Modified by Floodilka Contributors starting March 2026. See LICENSE and NOTICE.
 */

export const FeatureFlags = {
	MESSAGE_SCHEDULING: 'message_scheduling',
	EXPRESSION_PACKS: 'expression_packs',
} as const;

export type FeatureFlag = (typeof FeatureFlags)[keyof typeof FeatureFlags];

export const ALL_FEATURE_FLAGS: Array<FeatureFlag> = Object.values(FeatureFlags);

export const FEATURE_FLAG_KEY_PREFIX = 'feature_flag:';
export const FEATURE_FLAG_REDIS_KEY = 'feature_flags:config';
export const FEATURE_FLAG_USER_CACHE_PREFIX = 'feature_flag:user';
export const FEATURE_FLAG_USER_CACHE_TTL_SECONDS = 30;
export const FEATURE_FLAG_REFRESH_CHANNEL = 'feature_flags:refresh';
