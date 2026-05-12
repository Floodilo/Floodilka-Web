/*
 * SPDX-License-Identifier: AGPL-3.0-or-later
 * Copyright (C) 2020-2026 Fluxer Contributors
 * Copyright (C) 2026 Floodilka Contributors
 * Modified by Floodilka Contributors starting March 2026. See LICENSE and NOTICE.
 */

import type {HonoApp} from '~/App';
import {Config} from '~/Config';
import {AdminACLs} from '~/Constants';
import {requireAdminACL} from '~/middleware/AdminMiddleware';
import {RateLimitMiddleware} from '~/middleware/RateLimitMiddleware';
import {RateLimitConfigs} from '~/RateLimitConfig';
import {ProductType} from '~/payments/ProductRegistry';
import {Validator} from '~/Validator';
import {GenerateGiftCodesRequest, type GiftProductType} from '../models/CodeRequestTypes';

const trimTrailingSlash = (value: string): string => (value.endsWith('/') ? value.slice(0, -1) : value);

const giftDurations: Record<GiftProductType, number> = {
	[ProductType.GIFT_1_MONTH]: 1,
	[ProductType.GIFT_1_YEAR]: 12,
};

export const CodesAdminController = (app: HonoApp) => {
	app.post(
		'/admin/codes/gift',
		RateLimitMiddleware(RateLimitConfigs.ADMIN_CODE_GENERATION),
		requireAdminACL(AdminACLs.GIFT_CODES_GENERATE),
		Validator('json', GenerateGiftCodesRequest),
		async (ctx) => {
			const {count, product_type} = ctx.req.valid('json');
			const durationMonths = giftDurations[product_type];
			const codes = await ctx.get('adminService').generateGiftCodes(count, durationMonths);
			const baseUrl = trimTrailingSlash(Config.endpoints.gift);
			return ctx.json({
				codes: codes.map((code) => `${baseUrl}/${code}`),
			});
		},
	);
};
