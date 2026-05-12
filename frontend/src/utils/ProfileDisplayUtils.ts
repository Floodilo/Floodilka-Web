/*
 * SPDX-License-Identifier: AGPL-3.0-or-later
 * Copyright (C) 2020-2026 Fluxer Contributors
 * Copyright (C) 2026 Floodilka Contributors
 * Modified by Floodilka Contributors starting March 2026. See LICENSE and NOTICE.
 */

import type {GuildMemberRecord} from '~/records/GuildMemberRecord';
import type {ProfileRecord} from '~/records/ProfileRecord';
import type {UserProfile, UserRecord} from '~/records/UserRecord';
import * as AvatarUtils from '~/utils/AvatarUtils';

export interface ProfileDisplayContext {
	user: UserRecord;
	profile?: ProfileRecord | null;
	guildId?: string | null;
	guildMember?: GuildMemberRecord | null;
	guildMemberProfile?: UserProfile | null;
}

export interface ProfilePreviewOverrides {
	previewAvatarUrl?: string | null;
	previewBannerUrl?: string | null;
	hasClearedAvatar?: boolean;
	hasClearedBanner?: boolean;
	ignoreGuildAvatar?: boolean;
	ignoreGuildBanner?: boolean;
}

function getProfileAvatarUrl(
	context: ProfileDisplayContext,
	overrides?: ProfilePreviewOverrides,
	animated = false,
): string | null {
	const {user, guildId, guildMember} = context;
	const {previewAvatarUrl, hasClearedAvatar, ignoreGuildAvatar} = overrides || {};

	if (hasClearedAvatar) {
		return null;
	}

	if (previewAvatarUrl) {
		return previewAvatarUrl;
	}

	if (!ignoreGuildAvatar && guildId && guildMember) {
		if (guildMember.isAvatarUnset()) {
			return AvatarUtils.getUserAvatarURL({id: user.id, avatar: null}, animated);
		}
		if (guildMember.avatar) {
			return AvatarUtils.getGuildMemberAvatarURL({
				guildId,
				userId: user.id,
				avatar: guildMember.avatar,
				animated,
			});
		}
	}

	return AvatarUtils.getUserAvatarURL(user, animated);
}

export function getProfileBannerUrl(
	context: ProfileDisplayContext,
	overrides?: ProfilePreviewOverrides,
	animated = false,
	size = 1024,
): string | null {
	const {user, profile, guildId, guildMember, guildMemberProfile} = context;
	const {previewBannerUrl, hasClearedBanner, ignoreGuildBanner} = overrides || {};

	if (hasClearedBanner) {
		return null;
	}

	if (previewBannerUrl) {
		return previewBannerUrl;
	}

	let effectiveBanner: string | null = null;

	if (!ignoreGuildBanner && guildId && guildMember) {
		if (guildMember.isBannerUnset()) {
			return null;
		}
		if (guildMemberProfile?.banner) {
			if (guildMemberProfile.banner.startsWith('blob:') || guildMemberProfile.banner.startsWith('data:')) {
				return guildMemberProfile.banner;
			}
			return AvatarUtils.getGuildMemberBannerURL({
				guildId,
				userId: user.id,
				banner: guildMemberProfile.banner,
				animated,
				size,
			});
		}
	}

	if (profile?.userProfile?.banner) {
		effectiveBanner = profile.userProfile.banner;
	} else if (user.banner) {
		effectiveBanner = user.banner;
	}

	if (effectiveBanner) {
		if (effectiveBanner.startsWith('blob:') || effectiveBanner.startsWith('data:')) {
			return effectiveBanner;
		}
		return AvatarUtils.getUserBannerURL({id: user.id, banner: effectiveBanner}, animated, size);
	}

	return null;
}

export function getProfileBannerAsset(
	context: ProfileDisplayContext,
	overrides?: ProfilePreviewOverrides,
	size = 1024,
): AvatarUtils.BannerAsset | null {
	const {user, profile, guildId, guildMember, guildMemberProfile} = context;
	const {previewBannerUrl, hasClearedBanner, ignoreGuildBanner} = overrides || {};

	if (hasClearedBanner) {
		return null;
	}

	if (previewBannerUrl) {
		return {animated: false, videoUrl: null, imageUrl: previewBannerUrl};
	}

	if (!ignoreGuildBanner && guildId && guildMember) {
		if (guildMember.isBannerUnset()) {
			return null;
		}
		if (guildMemberProfile?.banner) {
			if (guildMemberProfile.banner.startsWith('blob:') || guildMemberProfile.banner.startsWith('data:')) {
				return {animated: false, videoUrl: null, imageUrl: guildMemberProfile.banner};
			}
			return AvatarUtils.getGuildMemberBannerAsset({
				guildId,
				userId: user.id,
				banner: guildMemberProfile.banner,
				size,
			});
		}
	}

	let effectiveBanner: string | null = null;
	if (profile?.userProfile?.banner) {
		effectiveBanner = profile.userProfile.banner;
	} else if (user.banner) {
		effectiveBanner = user.banner;
	}

	if (effectiveBanner) {
		if (effectiveBanner.startsWith('blob:') || effectiveBanner.startsWith('data:')) {
			return {animated: false, videoUrl: null, imageUrl: effectiveBanner};
		}
		return AvatarUtils.getUserBannerAsset({id: user.id, banner: effectiveBanner}, size);
	}

	return null;
}

export function getProfileAvatarUrls(
	context: ProfileDisplayContext,
	overrides?: ProfilePreviewOverrides,
): {
	avatarUrl: string | null;
	hoverAvatarUrl: string | null;
} {
	return {
		avatarUrl: getProfileAvatarUrl(context, overrides, false),
		hoverAvatarUrl: getProfileAvatarUrl(context, overrides, true),
	};
}
