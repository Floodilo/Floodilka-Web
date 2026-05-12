/*
 * SPDX-License-Identifier: AGPL-3.0-or-later
 * Copyright (C) 2020-2026 Fluxer Contributors
 * Copyright (C) 2026 Floodilka Contributors
 * Modified by Floodilka Contributors starting March 2026. See LICENSE and NOTICE.
 */

function truncateText(text: string, maxLength: number): string {
	if (text.length <= maxLength) {
		return text;
	}
	if (maxLength <= 3) {
		return text.slice(0, maxLength);
	}
	return `${text.slice(0, maxLength - 3)}...`;
}

export function getChannelPlaceholder(channelName: string, prefix: string, maxLength: number): string {
	const availableLength = maxLength - prefix.length;
	if (availableLength <= 0) {
		return prefix;
	}

	const truncatedName = truncateText(channelName, availableLength);
	return prefix + truncatedName;
}

export function getDMPlaceholder(username: string, prefix: string, maxLength: number): string {
	const availableLength = maxLength - prefix.length;
	if (availableLength <= 0) {
		return prefix;
	}

	const truncatedName = truncateText(username, availableLength);
	return prefix + truncatedName;
}
