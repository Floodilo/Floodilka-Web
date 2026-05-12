/*
 * SPDX-License-Identifier: AGPL-3.0-or-later
 * Copyright (C) 2020-2026 Fluxer Contributors
 * Copyright (C) 2026 Floodilka Contributors
 * Modified by Floodilka Contributors starting March 2026. See LICENSE and NOTICE.
 */

import {Config} from '~/Config';
import {UserFlags} from '~/Constants';
import type {UserRow} from '~/database/types/UserTypes';

interface PremiumCheckable {
	premiumType: number | null;
	premiumUntil: Date | null;
	premiumWillCancel: boolean;
	flags: bigint;
}

const GRACE_MS = 3 * 24 * 60 * 60 * 1000;

export function checkIsPremium(user: PremiumCheckable): boolean {
	if (Config.instance.selfHosted) {
		return true;
	}

	if ((user.flags & UserFlags.PREMIUM_ENABLED_OVERRIDE) !== 0n) {
		return true;
	}

	if (user.premiumType == null || user.premiumType <= 0) {
		return false;
	}

	if (user.premiumUntil == null) {
		return true;
	}

	const nowMs = Date.now();
	const untilMs = user.premiumUntil.getTime();

	if (user.premiumWillCancel) {
		return nowMs <= untilMs;
	}

	return nowMs <= untilMs + GRACE_MS;
}

export const PREMIUM_CLEAR_FIELDS = [
	'premium_type',
	'premium_since',
	'premium_until',
	'premium_will_cancel',
	'premium_billing_cycle',
] as const;

export type PremiumClearField = (typeof PREMIUM_CLEAR_FIELDS)[number];

export function shouldStripExpiredPremium(user: PremiumCheckable): boolean {
	if ((user.premiumType ?? 0) <= 0) {
		return false;
	}

	return !checkIsPremium(user);
}

export function mapExpiredPremiumFields<T>(mapper: (field: PremiumClearField) => T): Record<PremiumClearField, T> {
	const result = {} as Record<PremiumClearField, T>;
	for (const field of PREMIUM_CLEAR_FIELDS) {
		result[field] = mapper(field);
	}
	return result;
}

export function createPremiumClearPatch(): Partial<UserRow> {
	return mapExpiredPremiumFields(() => null) as Partial<UserRow>;
}
