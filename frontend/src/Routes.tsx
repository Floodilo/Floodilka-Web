/*
 * SPDX-License-Identifier: AGPL-3.0-or-later
 * Copyright (C) 2020-2026 Fluxer Contributors
 * Copyright (C) 2026 Floodilka Contributors
 * Modified by Floodilka Contributors starting March 2026. See LICENSE and NOTICE.
 */

import {siteUrl} from '~/utils/UrlUtils';

export const Routes = {
	HOME: '/',
	DOWNLOAD: '/download',
	LOGIN: '/login',
	REGISTER: '/register',
	FORGOT_PASSWORD: '/forgot',
	RESET_PASSWORD: '/reset',
	VERIFY_EMAIL: '/verify',

	EMAIL_REVERT: '/wasntme',
	OAUTH_AUTHORIZE: '/oauth2/authorize',

	INVITE_REGISTER: '/invite/:code',
	INVITE_LOGIN: '/invite/:code/login',
	GIFT_REGISTER: '/gift/:code',
	GIFT_LOGIN: '/gift/:code/login',
	ME: '/channels/@me',

	BOOKMARKS: '/bookmarks',
	MENTIONS: '/mentions',
	NOTIFICATIONS: '/notifications',
	YOU: '/you',
	REPORT: '/report',

	terms: () => siteUrl('terms'),
	privacy: () => siteUrl('privacy'),
	guidelines: () => siteUrl('guidelines'),
	careers: () => siteUrl('careers'),
	partners: () => siteUrl('partners'),
	bugs: () => siteUrl('bugs'),
	premium: () => siteUrl('premium'),
	dmChannel: (channelId: string) => `/channels/@me/${channelId}`,

	guildChannel: (guildId: string, channelId?: string) =>
		channelId ? `/channels/${guildId}/${channelId}` : `/channels/${guildId}`,
	channelMessage: (guildId: string, channelId: string, messageId: string) =>
		`${Routes.guildChannel(guildId, channelId)}/${messageId}`,
	dmChannelMessage: (channelId: string, messageId: string) => `${Routes.dmChannel(channelId)}/${messageId}`,

	inviteRegister: (code: string) => `/invite/${code}`,
	inviteLogin: (code: string) => `/invite/${code}/login`,
	giftRegister: (code: string) => `/gift/${code}`,
	giftLogin: (code: string) => `/gift/${code}/login`,
	isSpecialPage: (pathname: string) =>
		pathname === Routes.BOOKMARKS ||
		pathname === Routes.MENTIONS ||
		pathname === Routes.NOTIFICATIONS ||
		pathname === Routes.YOU,

	isDMRoute: (pathname: string) => pathname.startsWith('/channels/@me'),

	isChannelRoute: (pathname: string) => pathname.startsWith('/channels/'),
	isGuildChannelRoute: (pathname: string) =>
		pathname.startsWith('/channels/') &&
		!pathname.startsWith('/channels/@me'),
} as const;
