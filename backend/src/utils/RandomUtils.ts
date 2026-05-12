/*
 * SPDX-License-Identifier: AGPL-3.0-or-later
 * Copyright (C) 2020-2026 Fluxer Contributors
 * Copyright (C) 2026 Floodilka Contributors
 * Modified by Floodilka Contributors starting March 2026. See LICENSE and NOTICE.
 */

import crypto from 'node:crypto';

const RANDOM_STRING_ALPHABET = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

export const randomString = (length: number) => {
	const array = new Uint8Array(length);
	crypto.getRandomValues(array);
	let result = '';
	for (let i = 0; i < length; i++) {
		result += RANDOM_STRING_ALPHABET.charAt(array[i] % RANDOM_STRING_ALPHABET.length);
	}
	return result;
};
