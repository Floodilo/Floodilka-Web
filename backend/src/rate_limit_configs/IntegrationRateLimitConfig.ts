/*
 * SPDX-License-Identifier: AGPL-3.0-or-later
 * Copyright (C) 2020-2026 Fluxer Contributors
 * Copyright (C) 2026 Floodilka Contributors
 * Modified by Floodilka Contributors starting March 2026. See LICENSE and NOTICE.
 */

import type {RouteRateLimitConfig} from '~/middleware/RateLimitMiddleware';

export const IntegrationRateLimitConfigs = {
	KLIPY_SEARCH: {
		bucket: 'klipy:search',
		config: {limit: 40, windowMs: 10000},
	} as RouteRateLimitConfig,

	KLIPY_FEATURED: {
		bucket: 'klipy:featured',
		config: {limit: 40, windowMs: 10000},
	} as RouteRateLimitConfig,

	KLIPY_TRENDING: {
		bucket: 'klipy:trending',
		config: {limit: 40, windowMs: 10000},
	} as RouteRateLimitConfig,

	KLIPY_SUGGEST: {
		bucket: 'klipy:suggest',
		config: {limit: 40, windowMs: 10000},
	} as RouteRateLimitConfig,

	KLIPY_REGISTER_SHARE: {
		bucket: 'klipy:register_share',
		config: {limit: 60, windowMs: 10000},
	} as RouteRateLimitConfig,

	PREMIUM_PRICES: {
		bucket: 'premium:prices',
		config: {limit: 40, windowMs: 10000},
	} as RouteRateLimitConfig,

	PAYMENT_CHARGE: {
		bucket: 'payment:charge',
		config: {limit: 3, windowMs: 60000},
	} as RouteRateLimitConfig,

	PAYMENT_CHECKOUT_GIFT: {
		bucket: 'payment:checkout:gift',
		config: {limit: 3, windowMs: 60000},
	} as RouteRateLimitConfig,

	SUBSCRIPTION_CANCEL: {
		bucket: 'subscription:cancel',
		config: {limit: 5, windowMs: 60000},
	} as RouteRateLimitConfig,

	SUBSCRIPTION_REACTIVATE: {
		bucket: 'subscription:reactivate',
		config: {limit: 5, windowMs: 60000},
	} as RouteRateLimitConfig,

	GIFT_CODE_GET: {
		bucket: 'gift:get',
		config: {limit: 60, windowMs: 10000},
	} as RouteRateLimitConfig,

	GIFT_CODE_REDEEM: {
		bucket: 'gift:redeem',
		config: {limit: 10, windowMs: 60000},
	} as RouteRateLimitConfig,

	GIFTS_LIST: {
		bucket: 'gifts:list',
		config: {limit: 40, windowMs: 10000},
	} as RouteRateLimitConfig,
} as const;
