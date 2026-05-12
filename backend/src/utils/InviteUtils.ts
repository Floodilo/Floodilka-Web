/*
 * SPDX-License-Identifier: AGPL-3.0-or-later
 * Copyright (C) 2020-2026 Fluxer Contributors
 * Copyright (C) 2026 Floodilka Contributors
 * Modified by Floodilka Contributors starting March 2026. See LICENSE and NOTICE.
 */

import {Config} from '~/Config';
import * as RegexUtils from '~/utils/RegexUtils';

const INVITE_PATTERN = new RegExp(
	[
		'(?:https?:\\/\\/)?',
		'(?:',
		`${RegexUtils.escapeRegex(Config.hosts.invite)}(?:\\/#)?\\/(?!invite\\/)([a-zA-Z0-9\\-]{2,32})(?![a-zA-Z0-9\\-])`,
		'|',
		`${RegexUtils.escapeRegex(new URL(Config.endpoints.webApp).hostname)}(?:\\/#)?\\/invite\\/([a-zA-Z0-9\\-]{2,32})(?![a-zA-Z0-9\\-])`,
		')',
	].join(''),
	'gi',
);

export function findInvites(content: string | null): Array<string> {
	if (!content) return [];

	const invites: Array<string> = [];
	const seenCodes = new Set<string>();

	INVITE_PATTERN.lastIndex = 0;

	let match: RegExpExecArray | null;
	while ((match = INVITE_PATTERN.exec(content)) !== null && invites.length < 10) {
		const code = match[1] || match[2];
		if (code && !seenCodes.has(code)) {
			seenCodes.add(code);
			invites.push(code);
		}
	}

	return invites;
}

export function findInvite(content: string | null): string | null {
	if (!content) return null;

	INVITE_PATTERN.lastIndex = 0;
	const match = INVITE_PATTERN.exec(content);

	if (match) {
		return match[1] || match[2];
	}

	return null;
}
