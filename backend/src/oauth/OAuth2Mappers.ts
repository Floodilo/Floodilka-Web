/*
 * SPDX-License-Identifier: AGPL-3.0-or-later
 * Copyright (C) 2020-2026 Fluxer Contributors
 * Copyright (C) 2026 Floodilka Contributors
 * Modified by Floodilka Contributors starting March 2026. See LICENSE and NOTICE.
 */

import type {User} from '~/Models';
import type {Application} from '~/models/Application';
import {mapUserToPartialResponse} from '~/user/UserMappers';
import type {ApplicationBotResponse, ApplicationResponse} from './OAuth2Types';

export const mapBotUserToResponse = (user: User, opts?: {token?: string}): ApplicationBotResponse => {
	const partial = mapUserToPartialResponse(user);
	const bannerHash = !user.isBot && !user.isPremium() ? null : user.bannerHash;
	return {
		id: partial.id,
		username: partial.username,
		avatar: partial.avatar,
		banner: bannerHash,
		bio: user.bio ?? null,
		token: opts?.token,
		mfa_enabled: (user.authenticatorTypes?.size ?? 0) > 0,
		authenticator_types: user.authenticatorTypes ? Array.from(user.authenticatorTypes) : [],
	};
};

export const mapApplicationToResponse = (
	application: Application,
	options?: {
		botUser?: User | null;
		botToken?: string;
		clientSecret?: string | null;
	},
): ApplicationResponse => {
	const baseResponse: ApplicationResponse = {
		id: application.applicationId.toString(),
		name: application.name,
		redirect_uris: Array.from(application.oauth2RedirectUris),
		bot_public: application.botIsPublic,
		bot_require_code_grant: application.botRequireCodeGrant,
	};

	if (options?.botUser) {
		baseResponse.bot = mapBotUserToResponse(options.botUser, {token: options.botToken});
	}

	if (options?.clientSecret) {
		return {
			...baseResponse,
			client_secret: options.clientSecret,
		};
	}

	return baseResponse;
};

export const mapBotTokenResetResponse = (user: User, token: string) => {
	return {
		token,
		bot: mapBotUserToResponse(user),
	};
};

export const mapBotProfileToResponse = (user: User) => {
	return {
		id: user.id.toString(),
		username: user.username,
		avatar: user.avatarHash,
		banner: user.bannerHash,
		bio: user.bio,
	};
};
