/*
 * SPDX-License-Identifier: AGPL-3.0-or-later
 * Copyright (C) 2020-2026 Fluxer Contributors
 * Copyright (C) 2026 Floodilka Contributors
 * Modified by Floodilka Contributors starting March 2026. See LICENSE and NOTICE.
 */

import {z} from '~/Schema';
import {ProductType} from '~/payments/ProductRegistry';

const GiftProductTypes = [ProductType.GIFT_1_MONTH, ProductType.GIFT_1_YEAR] as const;

const MAX_CODES_PER_REQUEST = 100;

export const GiftProductTypeEnum = z.enum(GiftProductTypes);

export type GiftProductType = z.infer<typeof GiftProductTypeEnum>;

export const GenerateGiftCodesRequest = z.object({
	count: z.number().int().min(1).max(MAX_CODES_PER_REQUEST),
	product_type: GiftProductTypeEnum,
});

export type GenerateGiftCodesRequest = z.infer<typeof GenerateGiftCodesRequest>;
