/*
 * SPDX-License-Identifier: AGPL-3.0-or-later
 * Copyright (C) 2020-2026 Fluxer Contributors
 * Copyright (C) 2026 Floodilka Contributors
 * Modified by Floodilka Contributors starting March 2026. See LICENSE and NOTICE.
 */

const getRandomBytes = (size = 10) => crypto.getRandomValues(new Uint8Array(size));

const encodeTotpKey = (bin: Uint8Array) => {
	const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ234567';
	let bits = '';
	for (const byte of bin) {
		bits += byte.toString(2).padStart(8, '0');
	}

	let base32 = '';
	for (let i = 0; i < bits.length; i += 5) {
		const chunk = bits.substring(i, i + 5).padEnd(5, '0');
		base32 += alphabet[Number.parseInt(chunk, 2)];
	}

	return base32
		.toLowerCase()
		.replace(/(.{4})/g, '$1 ')
		.trim();
};

export const generateTotpSecret = () => encodeTotpKey(getRandomBytes());

export const encodeTotpSecret = (secret: string) => secret.replace(/[\s._-]+/g, '').toUpperCase();

export const encodeTotpSecretAsURL = (accountName: string, secret: string, issuer = 'Floodilka') =>
	`otpauth://totp/${encodeURIComponent(issuer)}:${encodeURIComponent(accountName)}\
?secret=${encodeTotpSecret(secret)}\
&issuer=${encodeURIComponent(issuer)}`;
