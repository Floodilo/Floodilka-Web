/*
 * SPDX-License-Identifier: AGPL-3.0-or-later
 * Copyright (C) 2020-2026 Fluxer Contributors
 * Copyright (C) 2026 Floodilka Contributors
 * Modified by Floodilka Contributors starting March 2026. See LICENSE and NOTICE.
 */

export function isTextInputKeyEvent(event: KeyboardEvent): boolean {
	const {key, ctrlKey, metaKey} = event;

	if (!key || key === 'Unidentified') {
		return false;
	}

	if (ctrlKey || metaKey) {
		return false;
	}

	if (key === 'Dead') {
		return true;
	}

	if (key.length > 1 && NAMED_KEY_PATTERN.test(key)) {
		return false;
	}

	const firstCodePoint = key.codePointAt(0)!;
	if (firstCodePoint <= 0x1f || (firstCodePoint >= 0x7f && firstCodePoint <= 0x9f)) {
		return false;
	}

	return true;
}

const NAMED_KEY_PATTERN = /^[A-Z][A-Za-z0-9]*$/;
