/*
 * SPDX-License-Identifier: AGPL-3.0-or-later
 * Copyright (C) 2020-2026 Fluxer Contributors
 * Copyright (C) 2026 Floodilka Contributors
 * Modified by Floodilka Contributors starting March 2026. See LICENSE and NOTICE.
 */

import type {I18n} from '@lingui/core';
import {msg} from '@lingui/core/macro';
import {Permissions} from '~/Constants';
import type {ChannelRecord} from '~/records/ChannelRecord';
import type {GuildStickerRecord} from '~/records/GuildStickerRecord';
import type {Emoji} from '~/stores/EmojiStore';
import PermissionStore from '~/stores/PermissionStore';
import UserStore from '~/stores/UserStore';

export interface AvailabilityCheck {
	canUse: boolean;
	isLockedByPremium: boolean;
	isLockedByPermission: boolean;
	lockReason?: string;
}

export function checkEmojiAvailability(i18n: I18n, emoji: Emoji, channel: ChannelRecord | null): AvailabilityCheck {
	if (!emoji.guildId) {
		return {
			canUse: true,
			isLockedByPremium: false,
			isLockedByPermission: false,
		};
	}

	const currentUser = UserStore.getCurrentUser();
	const hasPremium = currentUser?.isPremium() ?? false;

	if (!channel?.guildId) {
		if (!hasPremium) {
			return {
				canUse: false,
				isLockedByPremium: true,
				isLockedByPermission: false,
				lockReason: i18n._(msg`Unlock custom emojis in DMs with Premium`),
			};
		}
		return {
			canUse: true,
			isLockedByPremium: false,
			isLockedByPermission: false,
		};
	}

	const isExternalEmoji = emoji.guildId !== channel.guildId;

	if (!isExternalEmoji) {
		return {
			canUse: true,
			isLockedByPremium: false,
			isLockedByPermission: false,
		};
	}

	const hasPermission = PermissionStore.can(Permissions.USE_EXTERNAL_EMOJIS, {
		guildId: channel.guildId,
		channelId: channel.id,
	});

	if (!hasPermission) {
		if (!hasPremium) {
			return {
				canUse: false,
				isLockedByPremium: false,
				isLockedByPermission: true,
				lockReason: i18n._(msg`You lack permission to use external emojis in this channel`),
			};
		}
		return {
			canUse: false,
			isLockedByPremium: false,
			isLockedByPermission: true,
			lockReason: i18n._(msg`You lack permission to use external emojis in this channel`),
		};
	}

	if (!hasPremium) {
		return {
			canUse: false,
			isLockedByPremium: true,
			isLockedByPermission: false,
			lockReason: i18n._(msg`Unlock external custom emojis with Premium`),
		};
	}

	return {
		canUse: true,
		isLockedByPremium: false,
		isLockedByPermission: false,
	};
}

export function checkStickerAvailability(
	i18n: I18n,
	sticker: GuildStickerRecord,
	channel: ChannelRecord | null,
): AvailabilityCheck {
	if (!sticker.guildId) {
		return {
			canUse: true,
			isLockedByPremium: false,
			isLockedByPermission: false,
		};
	}

	const currentUser = UserStore.getCurrentUser();
	const hasPremium = currentUser?.isPremium() ?? false;

	if (!channel?.guildId) {
		if (!hasPremium) {
			return {
				canUse: false,
				isLockedByPremium: true,
				isLockedByPermission: false,
				lockReason: i18n._(msg`Unlock stickers in DMs with Premium`),
			};
		}
		return {
			canUse: true,
			isLockedByPremium: false,
			isLockedByPermission: false,
		};
	}

	const isExternalSticker = sticker.guildId !== channel.guildId;

	if (!isExternalSticker) {
		return {
			canUse: true,
			isLockedByPremium: false,
			isLockedByPermission: false,
		};
	}

	const hasPermission = PermissionStore.can(Permissions.USE_EXTERNAL_STICKERS, {
		guildId: channel.guildId,
		channelId: channel.id,
	});

	if (!hasPermission) {
		if (!hasPremium) {
			return {
				canUse: false,
				isLockedByPremium: false,
				isLockedByPermission: true,
				lockReason: i18n._(msg`You lack permission to use external stickers in this channel`),
			};
		}
		return {
			canUse: false,
			isLockedByPremium: false,
			isLockedByPermission: true,
			lockReason: i18n._(msg`You lack permission to use external stickers in this channel`),
		};
	}

	if (!hasPremium) {
		return {
			canUse: false,
			isLockedByPremium: true,
			isLockedByPermission: false,
			lockReason: i18n._(msg`Unlock external stickers with Premium`),
		};
	}

	return {
		canUse: true,
		isLockedByPremium: false,
		isLockedByPermission: false,
	};
}

export function filterEmojisForAutocomplete(
	i18n: I18n,
	emojis: ReadonlyArray<Emoji>,
	channel: ChannelRecord | null,
): ReadonlyArray<Emoji> {
	return emojis.filter((emoji) => {
		const check = checkEmojiAvailability(i18n, emoji, channel);
		return check.canUse;
	});
}

export function filterStickersForAutocomplete(
	i18n: I18n,
	stickers: ReadonlyArray<GuildStickerRecord>,
	channel: ChannelRecord | null,
): ReadonlyArray<GuildStickerRecord> {
	return stickers.filter((sticker) => {
		const check = checkStickerAvailability(i18n, sticker, channel);
		return check.canUse;
	});
}

export function shouldShowEmojiPremiumUpsell(channel: ChannelRecord | null): boolean {
	const currentUser = UserStore.getCurrentUser();
	const hasPremium = currentUser?.isPremium() ?? false;

	if (hasPremium) {
		return false;
	}

	if (!channel?.guildId) {
		return true;
	}

	const hasPermission = PermissionStore.can(Permissions.USE_EXTERNAL_EMOJIS, {
		guildId: channel.guildId,
		channelId: channel.id,
	});

	return hasPermission;
}

export function shouldShowStickerPremiumUpsell(channel: ChannelRecord | null): boolean {
	const currentUser = UserStore.getCurrentUser();
	const hasPremium = currentUser?.isPremium() ?? false;

	if (hasPremium) {
		return false;
	}

	if (!channel?.guildId) {
		return true;
	}

	const hasPermission = PermissionStore.can(Permissions.USE_EXTERNAL_STICKERS, {
		guildId: channel.guildId,
		channelId: channel.id,
	});

	return hasPermission;
}
