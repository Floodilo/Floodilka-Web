/*
 * SPDX-License-Identifier: AGPL-3.0-or-later
 * Copyright (C) 2020-2026 Fluxer Contributors
 * Copyright (C) 2026 Floodilka Contributors
 * Modified by Floodilka Contributors starting March 2026. See LICENSE and NOTICE.
 */

import {NewUsernameType} from '~/Schema';
import {transliterate as tr} from 'transliteration';

const MAX_USERNAME_LENGTH = 20;

function sanitizeDisplayName(globalName: string): string | null {
	const trimmed = globalName.trim();
	if (!trimmed) return null;

	let sanitized = tr(trimmed);
	sanitized = sanitized.replace(/[\s\-.]+/g, '_');
	sanitized = sanitized.replace(/[^a-zA-Z0-9_]/g, '');
	if (!sanitized) return null;
	if (sanitized.length > MAX_USERNAME_LENGTH) {
		sanitized = sanitized.substring(0, MAX_USERNAME_LENGTH);
	}

	const validation = NewUsernameType.safeParse(sanitized);
	if (!validation.success) {
		return null;
	}

	return sanitized;
}

export function deriveUsernameFromDisplayName(globalName: string): string | null {
	return sanitizeDisplayName(globalName);
}

export function generateUsernameSuggestions(globalName: string): Array<string> {
	const candidate = deriveUsernameFromDisplayName(globalName);
	return candidate ? [candidate] : [];
}
