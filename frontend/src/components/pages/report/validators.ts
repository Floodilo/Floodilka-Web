/*
 * SPDX-License-Identifier: AGPL-3.0-or-later
 * Copyright (C) 2020-2026 Fluxer Contributors
 * Copyright (C) 2026 Floodilka Contributors
 * Modified by Floodilka Contributors starting March 2026. See LICENSE and NOTICE.
 */

export const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
export const VERIFICATION_CODE_REGEX = /^[A-Z0-9]{4}-[A-Z0-9]{4}$/;

export function formatVerificationCodeInput(raw: string): string {
	const cleaned = raw
		.toUpperCase()
		.replace(/[^A-Z0-9]/g, '')
		.slice(0, 8);
	if (cleaned.length <= 4) return cleaned;
	return `${cleaned.slice(0, 4)}-${cleaned.slice(4)}`;
}

export function normalizeLikelyUrl(raw: string): string {
	const trimmed = raw.trim();
	if (!trimmed) return '';

	if (!/^[a-zA-Z][a-zA-Z\d+\-.]*:\/\//.test(trimmed)) {
		return `https://${trimmed}`;
	}

	return trimmed;
}

export function isValidHttpUrl(raw: string): boolean {
	try {
		const url = new URL(raw);
		return url.protocol === 'http:' || url.protocol === 'https:';
	} catch {
		return false;
	}
}
