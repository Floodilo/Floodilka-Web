/*
 * SPDX-License-Identifier: AGPL-3.0-or-later
 * Copyright (C) 2020-2026 Fluxer Contributors
 * Copyright (C) 2026 Floodilka Contributors
 * Modified by Floodilka Contributors starting March 2026. See LICENSE and NOTICE.
 */

import {useLingui} from '@lingui/react/macro';
import type {Channel} from '~/records/ChannelRecord';
import type {Guild, GuildRecord} from '~/records/GuildRecord';

export const getGroupDMTitle = (channel: Channel): string => {
	const {t} = useLingui();
	const channelName = channel.name?.trim();
	if (channelName && channelName.length > 0) {
		return channelName;
	}

	const recipients = channel.recipients ?? [];
	const names = recipients
		.map((recipient) => recipient.username)
		.filter((name): name is string => name !== undefined && name.length > 0);

	if (names.length === 0) {
		return t`Unnamed Group`;
	}

	return names.join(', ');
};

type InviteGuild = Guild | GuildRecord;

export const getGuildSplashAspectRatio = (guild: InviteGuild): number | undefined => {
	const width = 'splashWidth' in guild ? guild.splashWidth : guild.splash_width;
	const height = 'splashHeight' in guild ? guild.splashHeight : guild.splash_height;
	if (width != null && height != null && width > 0 && height > 0) {
		return width / height;
	}
	return undefined;
};

export const getGuildEmbedSplashAspectRatio = (guild: InviteGuild): number | undefined => {
	const width = 'embedSplashWidth' in guild ? guild.embedSplashWidth : guild.embed_splash_width;
	const height = 'embedSplashHeight' in guild ? guild.embedSplashHeight : guild.embed_splash_height;
	if (width != null && height != null && width > 0 && height > 0) {
		return width / height;
	}
	return undefined;
};

export const getImageAspectRatioFromBase64 = (base64Url: string): Promise<number> => {
	if (typeof Image === 'undefined') {
		return Promise.resolve(16 / 9);
	}

	return new Promise((resolve, reject) => {
		const img = new Image();
		img.onload = () => {
			if (img.naturalWidth > 0 && img.naturalHeight > 0) {
				resolve(img.naturalWidth / img.naturalHeight);
			} else {
				reject(new Error('Invalid image dimensions'));
			}
			img.onload = null;
			img.onerror = null;
		};
		img.onerror = () => {
			reject(new Error('Failed to load image'));
			img.onload = null;
			img.onerror = null;
		};
		img.src = base64Url;
	});
};
