/*
 * SPDX-License-Identifier: AGPL-3.0-or-later
 * Copyright (C) 2020-2026 Fluxer Contributors
 * Copyright (C) 2026 Floodilka Contributors
 * Modified by Floodilka Contributors starting March 2026. See LICENSE and NOTICE.
 */

import type {I18n} from '@lingui/core';
import {msg} from '@lingui/core/macro';
import type {Gift} from '~/actions/GiftActionCreators';

export type GiftDurationPluralization = (durationMonths: number) => string;

export interface GiftDurationTextConfig {
	lifetime: string;
	oneYear: string;
	plural: GiftDurationPluralization;
}

export interface GiftDurationPayload {
	duration_months: number;
}

export const formatGiftDurationText = (durationMonths: number, config: GiftDurationTextConfig): string => {
	if (durationMonths === 0) {
		return config.lifetime;
	}

	if (durationMonths === 12) {
		return config.oneYear;
	}

	return config.plural(durationMonths);
};

export const getPremiumDurationConfig = (i18n: I18n): GiftDurationTextConfig => ({
	lifetime: i18n._(msg`Lifetime Premium`),
	oneYear: i18n._(msg`1 Year of Premium`),
	plural: (durationMonths: number) =>
		i18n._(
			durationMonths === 1 ? msg`${durationMonths} Month of Premium` : msg`${durationMonths} Months of Premium`,
		),
});

export const getGiftDurationText = (i18n: I18n, gift: Gift | GiftDurationPayload): string =>
	formatGiftDurationText(gift.duration_months, getPremiumDurationConfig(i18n));

export const getPremiumGiftDurationText = (i18n: I18n, gift: Gift | GiftDurationPayload): string =>
	formatGiftDurationText(gift.duration_months, getPremiumDurationConfig(i18n));
