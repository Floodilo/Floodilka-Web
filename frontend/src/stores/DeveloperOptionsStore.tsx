/*
 * SPDX-License-Identifier: AGPL-3.0-or-later
 * Copyright (C) 2020-2026 Fluxer Contributors
 * Copyright (C) 2026 Floodilka Contributors
 * Modified by Floodilka Contributors starting March 2026. See LICENSE and NOTICE.
 */

import {makeAutoObservable} from 'mobx';
import AppStorage from '~/lib/AppStorage';
import {makePersistent} from '~/lib/MobXPersistence';

export type DeveloperOptionsState = Readonly<{
	bypassSplashScreen: boolean;
	forceFailUploads: boolean;
	forceFailMessageSends: boolean;
	forceRenderPlaceholders: boolean;
	forceEmbedSkeletons: boolean;
	forceMediaLoading: boolean;
	forceUpdateReady: boolean;
	forceNativeUpdateReady: boolean;
	mockNativeUpdateProgress: number | null;
	forceWebUpdateReady: boolean;
	mockUpdaterState: 'none' | 'checking' | 'available' | 'downloading' | 'ready' | 'installing' | 'error';
	showMyselfTyping: boolean;
	slowAttachmentUpload: boolean;
	slowMessageLoad: boolean;
	slowMessageSend: boolean;
	slowMessageEdit: boolean;
	slowProfileLoad: boolean;
	forceProfileDataWarning: boolean;
	useCloudUpload: boolean;
	debugLogging: boolean;
	forceGifPickerLoading: boolean;
	forceUnknownMessageType: boolean;
	selfHostedModeOverride: boolean;
	forceShowVanityURLDisclaimer: boolean;
	forceShowVoiceConnection: boolean;
	premiumTypeOverride: number | null;
	premiumSinceOverride: Date | null;
	premiumUntilOverride: Date | null;
	premiumBillingCycleOverride: string | null;
	premiumWillCancelOverride: boolean | null;
	hasEverPurchasedOverride: boolean | null;
	hasUnreadGiftInventoryOverride: boolean | null;
	unreadGiftInventoryCountOverride: number | null;
	emailVerifiedOverride: boolean | null;
	unclaimedAccountOverride: boolean | null;
	mockVerificationBarrier:
		| 'none'
		| 'unclaimed_account'
		| 'unverified_email'
		| 'account_too_new'
		| 'not_member_long'
		| 'no_phone'
		| 'send_message_disabled';
	mockBarrierTimeRemaining: number | null;
	mockNSFWGateReason: 'none' | 'age_restricted' | 'consent_required';
	mockNSFWMediaGateReason: 'none' | 'age_restricted';
	mockGeoBlocked: boolean;
	mockRequiredActionsOverlay: boolean;
	mockRequiredActionsMode: 'email' | 'phone' | 'email_or_phone';
	mockRequiredActionsSelectedTab: 'email' | 'phone';
	mockRequiredActionsPhoneStep: 'phone' | 'code';
	mockRequiredActionsResending: boolean;
	mockRequiredActionsResendOutcome: 'success' | 'rate_limited' | 'server_error';
	mockRequiredActionsReverify: boolean;
	forceNoSendMessages: boolean;
	forceNoAttachFiles: boolean;
	mockSlowmodeActive: boolean;
	mockSlowmodeRemaining: number;
	mockGiftInventory: boolean | null;
	mockGiftDurationMonths: number | null;
	mockGiftRedeemed: boolean | null;
	mockTitlebarPlatformOverride: 'auto' | 'macos' | 'windows' | 'linux';
	mockAttachmentStates: Record<
		string,
		{
			expired?: boolean;
			expiresAt?: string | null;
		}
	>;
}>;

type MutableDeveloperOptionsState = {
	-readonly [K in keyof DeveloperOptionsState]: DeveloperOptionsState[K];
};

class DeveloperOptionsStore implements DeveloperOptionsState {
	bypassSplashScreen = false;
	forceFailUploads = false;
	forceFailMessageSends = false;
	forceRenderPlaceholders = false;
	forceEmbedSkeletons = false;
	forceMediaLoading = false;
	forceUpdateReady = false;
	forceNativeUpdateReady = false;
	mockNativeUpdateProgress: number | null = null;
	forceWebUpdateReady = false;
	mockUpdaterState: DeveloperOptionsState['mockUpdaterState'] = 'none';
	showMyselfTyping = false;
	slowAttachmentUpload = false;
	slowMessageLoad = false;
	slowMessageSend = false;
	slowMessageEdit = false;
	slowProfileLoad = false;
	forceProfileDataWarning = false;
	useCloudUpload = false;
	debugLogging = false;
	forceGifPickerLoading = false;
	forceUnknownMessageType = false;
	selfHostedModeOverride = false;
	forceShowVanityURLDisclaimer = false;
	forceShowVoiceConnection = false;
	premiumTypeOverride: number | null = null;
	premiumSinceOverride: Date | null = null;
	premiumUntilOverride: Date | null = null;
	premiumBillingCycleOverride: string | null = null;
	premiumWillCancelOverride: boolean | null = null;
	hasEverPurchasedOverride: boolean | null = null;
	hasUnreadGiftInventoryOverride: boolean | null = null;
	unreadGiftInventoryCountOverride: number | null = null;
	emailVerifiedOverride: boolean | null = null;
	unclaimedAccountOverride: boolean | null = null;
	mockVerificationBarrier:
		| 'none'
		| 'unclaimed_account'
		| 'unverified_email'
		| 'account_too_new'
		| 'not_member_long'
		| 'no_phone'
		| 'send_message_disabled' = 'none';
	mockBarrierTimeRemaining: number | null = null;
	mockNSFWGateReason: 'none' | 'age_restricted' | 'consent_required' = 'none';
	mockNSFWMediaGateReason: 'none' | 'age_restricted' = 'none';
	mockGeoBlocked = false;
	mockRequiredActionsOverlay = false;
	mockRequiredActionsMode: 'email' | 'phone' | 'email_or_phone' = 'email';
	mockRequiredActionsSelectedTab: 'email' | 'phone' = 'email';
	mockRequiredActionsPhoneStep: 'phone' | 'code' = 'phone';
	mockRequiredActionsResending = false;
	mockRequiredActionsResendOutcome: 'success' | 'rate_limited' | 'server_error' = 'success';
	mockRequiredActionsReverify = false;
	forceNoSendMessages = false;
	forceNoAttachFiles = false;
	mockSlowmodeActive = false;
	mockSlowmodeRemaining = 10000;

	mockAttachmentStates: Record<
		string,
		{
			expired?: boolean;
			expiresAt?: string | null;
		}
	> = {};

	mockGiftInventory: boolean | null = null;
	mockGiftDurationMonths: number | null = 12;
	mockGiftRedeemed: boolean | null = null;
	mockTitlebarPlatformOverride: DeveloperOptionsState['mockTitlebarPlatformOverride'] = 'auto';

	constructor() {
		makeAutoObservable(this, {}, {autoBind: true});
		this.initPersistence();
	}

	private async initPersistence(): Promise<void> {
		await makePersistent(this, 'DeveloperOptionsStore', [
			'bypassSplashScreen',
			'forceFailUploads',
			'forceFailMessageSends',
			'forceRenderPlaceholders',
			'forceEmbedSkeletons',
			'forceMediaLoading',
			'forceUpdateReady',
			'forceNativeUpdateReady',
			'mockNativeUpdateProgress',
			'forceWebUpdateReady',
			'mockUpdaterState',
			'showMyselfTyping',
			'slowAttachmentUpload',
			'slowMessageLoad',
			'slowMessageSend',
			'slowMessageEdit',
			'slowProfileLoad',
			'forceProfileDataWarning',
			'useCloudUpload',
			'debugLogging',
			'forceGifPickerLoading',
			'forceUnknownMessageType',
			'selfHostedModeOverride',
			'forceShowVanityURLDisclaimer',
			'forceShowVoiceConnection',
			'premiumTypeOverride',
			'premiumSinceOverride',
			'premiumUntilOverride',
			'premiumBillingCycleOverride',
			'premiumWillCancelOverride',
			'hasEverPurchasedOverride',
			'hasUnreadGiftInventoryOverride',
			'unreadGiftInventoryCountOverride',
			'emailVerifiedOverride',
			'unclaimedAccountOverride',
			'mockVerificationBarrier',
			'mockBarrierTimeRemaining',
			'mockNSFWGateReason',
			'mockNSFWMediaGateReason',
			'mockGeoBlocked',
			'mockRequiredActionsOverlay',
			'mockRequiredActionsMode',
			'mockRequiredActionsSelectedTab',
			'mockRequiredActionsPhoneStep',
			'mockRequiredActionsResending',
			'mockRequiredActionsResendOutcome',
			'mockRequiredActionsReverify',
			'forceNoSendMessages',
			'forceNoAttachFiles',
			'mockSlowmodeActive',
			'mockSlowmodeRemaining',
			'mockGiftInventory',
			'mockGiftDurationMonths',
			'mockGiftRedeemed',
			'mockTitlebarPlatformOverride',
			'mockAttachmentStates',
		]);
	}

	updateOption<K extends keyof DeveloperOptionsStore & keyof DeveloperOptionsState>(
		key: K,
		value: DeveloperOptionsState[K],
	): void {
		(this as MutableDeveloperOptionsState)[key] = value;

		if (key === 'debugLogging') {
			AppStorage.setItem('debugLoggingEnabled', value?.toString() ?? 'false');
		}
	}
}

export default new DeveloperOptionsStore();
