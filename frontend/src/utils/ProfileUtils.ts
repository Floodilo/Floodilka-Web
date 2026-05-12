/*
 * SPDX-License-Identifier: AGPL-3.0-or-later
 * Copyright (C) 2020-2026 Fluxer Contributors
 * Copyright (C) 2026 Floodilka Contributors
 * Modified by Floodilka Contributors starting March 2026. See LICENSE and NOTICE.
 */

import {UserPremiumTypes} from '~/Constants';
import {ProfileRecord} from '~/records/ProfileRecord';
import type {UserRecord} from '~/records/UserRecord';

export interface BadgeSettings {
	premium_badge_hidden?: boolean;
	premium_badge_timestamp_hidden?: boolean;
}

function computeVisiblePremiumData(user: UserRecord, previewBadgeSettings?: BadgeSettings) {
	const premiumType = user.premiumType;
	const premiumSince = user.premiumSince;

	if (!premiumType || premiumType === UserPremiumTypes.NONE) {
		return {
			premiumType: null,
			premiumSince: null,
		};
	}

	const premiumBadgeHidden = previewBadgeSettings?.premium_badge_hidden ?? user.premiumBadgeHidden;
	const premiumBadgeTimestampHidden =
		previewBadgeSettings?.premium_badge_timestamp_hidden ?? user.premiumBadgeTimestampHidden;

	if (premiumBadgeHidden) {
		return {
			premiumType: null,
			premiumSince: null,
		};
	}

	const visiblePremiumType = premiumType;
	let visiblePremiumSince = premiumSince;

	if (premiumBadgeTimestampHidden) {
		visiblePremiumSince = null;
	}

	let premiumSinceString: string | null = null;
	if (visiblePremiumSince) {
		if (typeof visiblePremiumSince === 'string') {
			premiumSinceString = visiblePremiumSince;
		} else if (visiblePremiumSince instanceof Date) {
			premiumSinceString = visiblePremiumSince.toISOString();
		}
	}

	return {
		premiumType: visiblePremiumType,
		premiumSince: premiumSinceString,
	};
}

export function createMockProfile(
	user: UserRecord,
	options?: {
		previewBannerUrl?: string | null;
		hasClearedBanner?: boolean;
		previewBio?: string | null;
		previewBadgeSettings?: BadgeSettings;
	},
): ProfileRecord {
	const finalBanner = options?.hasClearedBanner
		? null
		: options?.previewBannerUrl
			? options.previewBannerUrl
			: user.banner || null;
	const finalBio = options?.previewBio !== undefined ? options.previewBio : user.bio || null;
	const visiblePremiumData = computeVisiblePremiumData(user, options?.previewBadgeSettings);

	return new ProfileRecord({
		user: user.toJSON(),
		user_profile: {
			bio: finalBio,
			banner: finalBanner,
		},
		timezone_offset: null,
		premium_type: visiblePremiumData.premiumType ?? undefined,
		premium_since: visiblePremiumData.premiumSince ?? undefined,
	});
}
