/*
 * SPDX-License-Identifier: AGPL-3.0-or-later
 * Copyright (C) 2020-2026 Fluxer Contributors
 * Copyright (C) 2026 Floodilka Contributors
 * Modified by Floodilka Contributors starting March 2026. See LICENSE and NOTICE.
 */

import {createStringType, Int64Type, z} from '~/Schema';

const RedirectURIString = createStringType(1).refine((value) => {
	try {
		const u = new URL(value);
		return !!u.protocol && !!u.host;
	} catch {
		return false;
	}
}, 'Invalid URL format');

export const OAuthScopes = ['identify', 'email', 'guilds', 'bot', 'applications.commands'] as const;

export type OAuthScope = (typeof OAuthScopes)[number];

export const AuthorizeRequest = z.object({
	response_type: z.literal('code').optional(),
	client_id: Int64Type,
	redirect_uri: RedirectURIString.optional(),
	scope: createStringType(1),
	state: createStringType(1).optional(),
	prompt: z.enum(['consent', 'none']).optional(),
	guild_id: Int64Type.optional(),
	permissions: z.string().optional(),
	disable_guild_select: z.enum(['true', 'false']).optional(),
});

export const AuthorizeConsentRequest = z.object({
	response_type: z.string().optional(),
	client_id: Int64Type,
	redirect_uri: RedirectURIString.optional(),
	scope: createStringType(1),
	state: createStringType(1).optional(),
	permissions: z.string().optional(),
	guild_id: Int64Type.optional(),
});

export const TokenRequest = z.discriminatedUnion('grant_type', [
	z.object({
		grant_type: z.literal('authorization_code'),
		code: createStringType(1),
		redirect_uri: RedirectURIString,
		client_id: Int64Type.optional(),
		client_secret: createStringType(1).optional(),
	}),
	z.object({
		grant_type: z.literal('refresh_token'),
		refresh_token: createStringType(1),
		client_id: Int64Type.optional(),
		client_secret: createStringType(1).optional(),
	}),
]);

export const IntrospectRequestForm = z.object({
	token: createStringType(1),
	client_id: Int64Type.optional(),
	client_secret: createStringType(1).optional(),
});

export const RevokeRequestForm = z.object({
	token: createStringType(1),
	token_type_hint: z.enum(['access_token', 'refresh_token']).optional(),
	client_id: Int64Type.optional(),
	client_secret: createStringType(1).optional(),
});

export type AuthorizeRequest = z.infer<typeof AuthorizeRequest>;
export type TokenRequest = z.infer<typeof TokenRequest>;
