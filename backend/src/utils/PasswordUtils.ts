/*
 * SPDX-License-Identifier: AGPL-3.0-or-later
 * Copyright (C) 2020-2026 Fluxer Contributors
 * Copyright (C) 2026 Floodilka Contributors
 * Modified by Floodilka Contributors starting March 2026. See LICENSE and NOTICE.
 */

import argon2 from 'argon2';
import bcrypt from 'bcrypt';

export async function hashPassword(password: string): Promise<string> {
	return argon2.hash(password);
}

function isBcryptHash(hash: string): boolean {
	return hash.startsWith('$2b$') || hash.startsWith('$2a$');
}

export function needsRehash(passwordHash: string): boolean {
	return isBcryptHash(passwordHash);
}

export async function verifyPassword({
	password,
	passwordHash,
}: {
	password: string;
	passwordHash: string;
}): Promise<boolean> {
	if (isBcryptHash(passwordHash)) {
		return bcrypt.compare(password, passwordHash);
	}
	return argon2.verify(passwordHash, password);
}
