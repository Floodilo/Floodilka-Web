/*
 * SPDX-License-Identifier: AGPL-3.0-or-later
 * Copyright (C) 2020-2026 Fluxer Contributors
 * Copyright (C) 2026 Floodilka Contributors
 * Modified by Floodilka Contributors starting March 2026. See LICENSE and NOTICE.
 */

import {isLinkWrappedInAngleBrackets} from '~/utils/linkSuppressionUtils';
import * as RegexUtils from '~/utils/RegexUtils';

export interface CodeLinkConfig {
	urlBase: string;
	path: string;
}

const patternCache = new Map<string, RegExp>();

function createPattern(config: CodeLinkConfig): RegExp {
	const cacheKey = `${config.urlBase}:${config.path}`;

	let pattern = patternCache.get(cacheKey);
	if (pattern) {
		return pattern;
	}

	const branches: Array<string> = [];
	const slashIndex = config.urlBase.indexOf('/');

	if (slashIndex !== -1) {
		const host = config.urlBase.slice(0, slashIndex);
		const path = config.urlBase.slice(slashIndex);
		branches.push(
			`${RegexUtils.escapeRegex(host)}(?:\\/#)?${RegexUtils.escapeRegex(path)}\\/([a-zA-Z0-9\\-]{2,32})(?![a-zA-Z0-9\\-])`,
		);
	} else {
		branches.push(
			`${RegexUtils.escapeRegex(config.urlBase)}(?:\\/#)?\\/(?!${config.path}\\/)([a-zA-Z0-9\\-]{2,32})(?![a-zA-Z0-9\\-])`,
		);
	}

	branches.push(
		`${RegexUtils.escapeRegex(location.host)}(?:\\/#)?\\/${config.path}\\/([a-zA-Z0-9\\-]{2,32})(?![a-zA-Z0-9\\-])`,
	);

	pattern = new RegExp(`(?:https?:\\/\\/)?(?:${branches.join('|')})`, 'gi');

	patternCache.set(cacheKey, pattern);
	return pattern;
}

export function findCodes(content: string | null, config: CodeLinkConfig): Array<string> {
	if (!content) return [];

	const codes: Array<string> = [];
	const seenCodes = new Set<string>();
	const pattern = createPattern(config);

	pattern.lastIndex = 0;

	let match: RegExpExecArray | null;
	while ((match = pattern.exec(content)) !== null && codes.length < 10) {
		const matchedText = match[0];
		if (isLinkWrappedInAngleBrackets(content, match.index ?? 0, matchedText.length)) {
			continue;
		}
		const code = match[1] || match[2];
		if (code && !seenCodes.has(code)) {
			seenCodes.add(code);
			codes.push(code);
		}
	}

	return codes;
}

export function findCode(content: string | null, config: CodeLinkConfig): string | null {
	if (!content) return null;

	const pattern = createPattern(config);
	pattern.lastIndex = 0;
	let match: RegExpExecArray | null;
	while ((match = pattern.exec(content)) !== null) {
		const matchedText = match[0];
		if (isLinkWrappedInAngleBrackets(content, match.index ?? 0, matchedText.length)) {
			continue;
		}

		const code = match[1] || match[2];
		if (code) {
			return code;
		}
	}

	return null;
}
