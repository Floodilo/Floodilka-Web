/*
 * SPDX-License-Identifier: AGPL-3.0-or-later
 * Copyright (C) 2020-2026 Fluxer Contributors
 * Copyright (C) 2026 Floodilka Contributors
 * Modified by Floodilka Contributors starting March 2026. See LICENSE and NOTICE.
 */

import {adjectives, animals, colors, uniqueNamesGenerator} from 'unique-names-generator';

export function generateRandomUsername(): string {
	const MAX_LENGTH = 32;
	const MAX_ATTEMPTS = 100;

	for (let i = 0; i < MAX_ATTEMPTS; i++) {
		const username = uniqueNamesGenerator({
			dictionaries: [adjectives, colors, animals],
			separator: '',
			style: 'capital',
			length: 3,
		});

		if (username.length <= MAX_LENGTH) {
			return username;
		}
	}

	for (let i = 0; i < MAX_ATTEMPTS; i++) {
		const username = uniqueNamesGenerator({
			dictionaries: [adjectives, animals],
			separator: '',
			style: 'capital',
			length: 2,
		});

		if (username.length <= MAX_LENGTH) {
			return username;
		}
	}

	for (let i = 0; i < MAX_ATTEMPTS; i++) {
		const username = uniqueNamesGenerator({
			dictionaries: [animals],
			separator: '',
			style: 'capital',
			length: 1,
		});

		if (username.length <= MAX_LENGTH) {
			return username;
		}
	}

	return uniqueNamesGenerator({
		dictionaries: [animals],
		separator: '',
		style: 'capital',
		length: 1,
	});
}
