/*
 * SPDX-License-Identifier: AGPL-3.0-or-later
 * Copyright (C) 2020-2026 Fluxer Contributors
 * Copyright (C) 2026 Floodilka Contributors
 * Modified by Floodilka Contributors starting March 2026. See LICENSE and NOTICE.
 */

export function isLinkWrappedInAngleBrackets(content: string, matchStart: number, matchLength: number): boolean {
	if (matchLength <= 0) return false;

	const beforeIndex = matchStart - 1;
	const afterIndex = matchStart + matchLength;

	if (beforeIndex < 0 || afterIndex >= content.length) {
		return false;
	}

	return content[beforeIndex] === '<' && content[afterIndex] === '>';
}
