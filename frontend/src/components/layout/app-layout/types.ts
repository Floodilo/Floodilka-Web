/*
 * SPDX-License-Identifier: AGPL-3.0-or-later
 * Copyright (C) 2020-2026 Fluxer Contributors
 * Copyright (C) 2026 Floodilka Contributors
 * Modified by Floodilka Contributors starting March 2026. See LICENSE and NOTICE.
 */

export const NagbarType = {
	UNCLAIMED_ACCOUNT: 'unclaimed-account',
	EMAIL_VERIFICATION: 'email-verification',
	DESKTOP_NOTIFICATION: 'desktop-notification',
	PREMIUM_GRACE_PERIOD: 'premium-grace-period',
	PREMIUM_EXPIRED: 'premium-expired',
	PREMIUM_ONBOARDING: 'premium-onboarding',
	GIFT_INVENTORY: 'gift-inventory',
	BULK_DELETE_PENDING: 'bulk-delete-pending',
	DESKTOP_DOWNLOAD: 'desktop-download',
	GUILD_MEMBERSHIP_CTA: 'guild-membership-cta',
} as const;

export type NagbarType = (typeof NagbarType)[keyof typeof NagbarType];

export interface NagbarState {
	type: NagbarType;
	priority: number;
	visible: boolean;
}

export interface AppLayoutState {
	isStandalone: boolean;
}

export interface NagbarConditions {
	userIsUnclaimed: boolean;
	userNeedsVerification: boolean;
	canShowDesktopNotification: boolean;
	canShowPremiumGracePeriod: boolean;
	canShowPremiumExpired: boolean;
	canShowPremiumOnboarding: boolean;
	canShowGiftInventory: boolean;
	canShowDesktopDownload: boolean;
	hasPendingBulkMessageDeletion: boolean;
	canShowGuildMembershipCta: boolean;
}

export const UPDATE_DISMISS_KEY = 'floodilka_update_dismissed_until';
