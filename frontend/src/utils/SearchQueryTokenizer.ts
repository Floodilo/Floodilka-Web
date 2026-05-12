/*
 * SPDX-License-Identifier: AGPL-3.0-or-later
 * Copyright (C) 2020-2026 Fluxer Contributors
 * Copyright (C) 2026 Floodilka Contributors
 * Modified by Floodilka Contributors starting March 2026. See LICENSE and NOTICE.
 */

const KNOWN_FILTER_PREFIXES = new Set([
	'from:',
	'-from:',
	'mentions:',
	'-mentions:',
	'in:',
	'-in:',
	'before:',
	'during:',
	'on:',
	'after:',
	'has:',
	'-has:',
	'pinned:',
	'author-type:',
	'sort:',
	'order:',
	'nsfw:',
	'embed-type:',
	'-embed-type:',
	'embed-provider:',
	'-embed-provider:',
	'link:',
	'-link:',
	'filename:',
	'-filename:',
	'ext:',
	'-ext:',
	'last:',
	'beforeid:',
	'afterid:',
	'any:',
	'scope:',
]);

const isFilterPrefix = (text: string): boolean => {
	const lower = text.toLowerCase();
	for (const prefix of KNOWN_FILTER_PREFIXES) {
		if (lower.startsWith(prefix)) {
			return true;
		}
	}
	return false;
};

const skipFilterValue = (query: string, startIndex: number): number => {
	let i = startIndex;
	const n = query.length;
	let inQuotes = false;
	let escaped = false;

	while (i < n) {
		const ch = query[i];
		if (escaped) {
			escaped = false;
			i++;
			continue;
		}
		if (ch === '\\') {
			escaped = true;
			i++;
			continue;
		}
		if (ch === '"') {
			inQuotes = !inQuotes;
			i++;
			continue;
		}
		if (!inQuotes && ch === ' ') {
			break;
		}
		i++;
	}
	return i;
};

export const tokenizeSearchQuery = (query: string): Array<string> => {
	const tokens: Array<string> = [];
	const n = query.length;
	let i = 0;

	while (i < n) {
		while (i < n && query[i] === ' ') {
			i++;
		}
		if (i >= n) {
			break;
		}

		const remaining = query.slice(i);
		if (isFilterPrefix(remaining)) {
			const colonIndex = remaining.indexOf(':');
			if (colonIndex !== -1) {
				i = skipFilterValue(query, i + colonIndex + 1);
				continue;
			}
		}

		if (query[i] === '"') {
			i++;
			let token = '';
			let escaped = false;
			while (i < n) {
				const ch = query[i];
				if (escaped) {
					token += ch;
					escaped = false;
					i++;
					continue;
				}
				if (ch === '\\') {
					escaped = true;
					i++;
					continue;
				}
				if (ch === '"') {
					i++;
					break;
				}
				token += ch;
				i++;
			}
			const trimmed = token.trim();
			if (trimmed) {
				tokens.push(trimmed);
			}
			continue;
		}

		let token = '';
		while (i < n && query[i] !== ' ' && query[i] !== '"') {
			token += query[i];
			i++;
		}
		const trimmed = token.trim();
		if (trimmed) {
			tokens.push(trimmed);
		}
	}

	return tokens;
};
