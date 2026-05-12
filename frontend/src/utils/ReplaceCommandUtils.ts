/*
 * SPDX-License-Identifier: AGPL-3.0-or-later
 * Copyright (C) 2020-2026 Fluxer Contributors
 * Copyright (C) 2026 Floodilka Contributors
 * Modified by Floodilka Contributors starting March 2026. See LICENSE and NOTICE.
 */

const REPLACE_REGEX = /^s\/([^/]+)\/([^/]+)(\/g)?$/;

interface ReplaceCommand {
	source: string;
	replacement: string;
	global: boolean;
}

export function parseReplaceCommand(content: string): ReplaceCommand | null {
	const match = content.match(REPLACE_REGEX);
	if (!match) {
		return null;
	}

	const [, source, replacement, globalFlag] = match;
	return {
		source,
		replacement,
		global: !!globalFlag,
	};
}

export function executeReplaceCommand(text: string, command: ReplaceCommand): string {
	const regex = new RegExp(command.source, command.global ? 'g' : '');
	return text.replace(regex, command.replacement);
}

export function isReplaceCommand(content: string): boolean {
	return REPLACE_REGEX.test(content);
}
