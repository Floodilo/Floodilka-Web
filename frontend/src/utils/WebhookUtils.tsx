/*
 * SPDX-License-Identifier: AGPL-3.0-or-later
 * Copyright (C) 2020-2026 Fluxer Contributors
 * Copyright (C) 2026 Floodilka Contributors
 * Modified by Floodilka Contributors starting March 2026. See LICENSE and NOTICE.
 */

import {adjectives, animals, uniqueNamesGenerator} from 'unique-names-generator';

export function generateRandomWebhookName(): string {
	return uniqueNamesGenerator({
		dictionaries: [adjectives, animals],
		separator: ' ',
		style: 'capital',
		length: 2,
	});
}
