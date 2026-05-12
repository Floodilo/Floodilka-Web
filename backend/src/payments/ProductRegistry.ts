/*
 * SPDX-License-Identifier: AGPL-3.0-or-later
 * Copyright (C) 2020-2026 Fluxer Contributors
 * Copyright (C) 2026 Floodilka Contributors
 * Modified by Floodilka Contributors starting March 2026. See LICENSE and NOTICE.
 */

import {UserPremiumTypes} from '~/Constants';

export enum ProductType {
	MONTHLY_SUBSCRIPTION = 'monthly_subscription',
	YEARLY_SUBSCRIPTION = 'yearly_subscription',
	GIFT_1_MONTH = 'gift_1_month',
	GIFT_1_YEAR = 'gift_1_year',
}

export interface ProductInfo {
	type: ProductType;
	premiumType: 1;
	durationMonths: number;
	isGift: boolean;
	billingCycle?: 'monthly' | 'yearly';
	amountRub: number;
}

export function getProductByType(productType: string): ProductInfo | null {
	return PRODUCTS.get(productType) ?? null;
}

export function getProductForSubscription(billingCycle: 'monthly' | 'yearly'): ProductInfo {
	return billingCycle === 'yearly' ? PRODUCTS.get(ProductType.YEARLY_SUBSCRIPTION)! : PRODUCTS.get(ProductType.MONTHLY_SUBSCRIPTION)!;
}

export function getProductForGift(durationMonths: number): ProductInfo | null {
	if (durationMonths === 1) return PRODUCTS.get(ProductType.GIFT_1_MONTH) ?? null;
	if (durationMonths === 12) return PRODUCTS.get(ProductType.GIFT_1_YEAR) ?? null;
	return null;
}

export function isRecurringSubscription(info: ProductInfo): boolean {
	return !info.isGift && info.premiumType === UserPremiumTypes.SUBSCRIPTION;
}

const PRODUCTS = new Map<string, ProductInfo>([
	[
		ProductType.MONTHLY_SUBSCRIPTION,
		{
			type: ProductType.MONTHLY_SUBSCRIPTION,
			premiumType: UserPremiumTypes.SUBSCRIPTION,
			durationMonths: 1,
			isGift: false,
			billingCycle: 'monthly',
			amountRub: 0,
		},
	],
	[
		ProductType.YEARLY_SUBSCRIPTION,
		{
			type: ProductType.YEARLY_SUBSCRIPTION,
			premiumType: UserPremiumTypes.SUBSCRIPTION,
			durationMonths: 12,
			isGift: false,
			billingCycle: 'yearly',
			amountRub: 0,
		},
	],
	[
		ProductType.GIFT_1_MONTH,
		{
			type: ProductType.GIFT_1_MONTH,
			premiumType: UserPremiumTypes.SUBSCRIPTION,
			durationMonths: 1,
			isGift: true,
			amountRub: 0,
		},
	],
	[
		ProductType.GIFT_1_YEAR,
		{
			type: ProductType.GIFT_1_YEAR,
			premiumType: UserPremiumTypes.SUBSCRIPTION,
			durationMonths: 12,
			isGift: true,
			amountRub: 0,
		},
	],
]);

export function initializeProductPrices(prices: {
	monthlyRub: number;
	yearlyRub: number;
	gift1MonthRub: number;
	gift1YearRub: number;
}): void {
	const monthly = PRODUCTS.get(ProductType.MONTHLY_SUBSCRIPTION)!;
	monthly.amountRub = prices.monthlyRub;

	const yearly = PRODUCTS.get(ProductType.YEARLY_SUBSCRIPTION)!;
	yearly.amountRub = prices.yearlyRub;

	const gift1Month = PRODUCTS.get(ProductType.GIFT_1_MONTH)!;
	gift1Month.amountRub = prices.gift1MonthRub;

	const gift1Year = PRODUCTS.get(ProductType.GIFT_1_YEAR)!;
	gift1Year.amountRub = prices.gift1YearRub;
}
