/*
 * SPDX-License-Identifier: AGPL-3.0-or-later
 * Copyright (C) 2020-2026 Fluxer Contributors
 * Copyright (C) 2026 Floodilka Contributors
 * Modified by Floodilka Contributors starting March 2026. See LICENSE and NOTICE.
 */

export const VerificationErrorType = {
	LINK_EXPIRED: 'LINK_EXPIRED',
	SERVER_ERROR: 'SERVER_ERROR',
	INVALID_TOKEN: 'INVALID_TOKEN',
} as const;

export type VerificationErrorType = (typeof VerificationErrorType)[keyof typeof VerificationErrorType];

export interface VerificationError {
	type: VerificationErrorType;
	message?: string;
}

export const createVerificationError = (type: VerificationErrorType, message?: string): VerificationError => ({
	type,
	message,
});
