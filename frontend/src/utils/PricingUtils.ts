/*
 * SPDX-License-Identifier: AGPL-3.0-or-later
 * Copyright (C) 2020-2026 Fluxer Contributors
 * Copyright (C) 2026 Floodilka Contributors
 * Modified by Floodilka Contributors starting March 2026. See LICENSE and NOTICE.
 */

export enum PricingTier {
	Monthly = 'monthly',
	Yearly = 'yearly',
}

export function formatPrice(price: number): string {
	return `${price.toLocaleString('ru-RU')} \u20BD`;
}
