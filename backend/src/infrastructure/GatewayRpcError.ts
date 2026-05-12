/*
 * SPDX-License-Identifier: AGPL-3.0-or-later
 * Copyright (C) 2020-2026 Fluxer Contributors
 * Copyright (C) 2026 Floodilka Contributors
 * Modified by Floodilka Contributors starting March 2026. See LICENSE and NOTICE.
 */

export const GatewayRpcMethodErrorCodes = {
	GUILD_NOT_FOUND: 'guild_not_found',
	FORBIDDEN: 'forbidden',
	USER_NOT_IN_VOICE: 'user_not_in_voice',
	NO_ACTIVE_CALL: 'no_active_call',
	CALL_ALREADY_EXISTS: 'call_already_exists',
	INVALID_CHANNEL_TYPE_FOR_CALL: 'invalid_channel_type_for_call',
	UNKNOWN_CHANNEL: 'unknown_channel',
	OVERLOADED: 'overloaded',
	MISSING_PERMISSIONS: 'missing_permissions',
} as const;

export type GatewayRpcMethodErrorCode = (typeof GatewayRpcMethodErrorCodes)[keyof typeof GatewayRpcMethodErrorCodes];

export class GatewayRpcMethodError extends Error {
	readonly code: string;

	constructor(code: string, message?: string) {
		super(message ?? code);
		this.name = 'GatewayRpcMethodError';
		this.code = code;
	}
}
