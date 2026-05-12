/*
 * SPDX-License-Identifier: AGPL-3.0-or-later
 * Copyright (C) 2020-2026 Fluxer Contributors
 * Copyright (C) 2026 Floodilka Contributors
 * Modified by Floodilka Contributors starting March 2026. See LICENSE and NOTICE.
 */

import {useMemo} from 'react';

export function generatePlaceholderSpecs(options: {
	compact: boolean;
	messageGroups: number;
	groupRange: number;
	attachments: number;
	fontSize: number;
	groupSpacing: number;
}): {
	messages: Array<number>;
	attachmentSpecs: Array<[number, {width: number; height: number}] | undefined>;
	totalHeight: number;
	groupSpacing: number;
} {
	const {compact, messageGroups, groupRange, attachments, fontSize, groupSpacing} = options;

	if (attachments > messageGroups) {
		throw new Error(
			`generatePlaceholderSpecs: too many attachments relative to messageGroups: ${messageGroups}, ${attachments}`,
		);
	}

	const DEFAULT_FONT_SIZE = 16;
	const scale = fontSize / DEFAULT_FONT_SIZE;

	const MESSAGE_HEIGHT_COZY = 22;
	const MESSAGE_HEIGHT_COMPACT = 16;
	const ATTACHMENT_MARGIN = 8;

	const messageHeight = compact ? MESSAGE_HEIGHT_COMPACT : MESSAGE_HEIGHT_COZY;

	let totalHeight = 0;
	const messageCounts: Array<number> = [];

	for (let i = 0; i < messageGroups; i++) {
		const count = Math.floor(Math.random() * groupRange) + 1;
		messageCounts.push(count);

		totalHeight += groupSpacing * scale;
		totalHeight += messageHeight * scale;
		totalHeight += (count - 1) * messageHeight * scale;
	}

	const availableGroupIndices = messageCounts.map((_, i) => i);
	const attachmentSpecs: Array<[number, {width: number; height: number}] | undefined> =
		Array(messageGroups).fill(undefined);

	for (let i = 0; i < attachments; i++) {
		const randomIndex = Math.floor(Math.random() * availableGroupIndices.length);
		const groupIndex = availableGroupIndices.splice(randomIndex, 1)[0];

		const width = Math.floor(Math.random() * (400 - 140 + 1)) + 140;
		const height = Math.floor(Math.random() * (320 - 100 + 1)) + 100;

		attachmentSpecs[groupIndex] = [groupIndex, {width, height}];
		totalHeight += height + ATTACHMENT_MARGIN * scale;
	}

	return {
		messages: messageCounts,
		attachmentSpecs,
		totalHeight,
		groupSpacing,
	};
}

export function usePlaceholderSpecs(compact: boolean, groupSpacing: number, fontSize: number) {
	return useMemo(() => {
		return compact
			? generatePlaceholderSpecs({
					compact: true,
					messageGroups: 30,
					groupRange: 4,
					attachments: 8,
					fontSize,
					groupSpacing,
				})
			: generatePlaceholderSpecs({
					compact: false,
					messageGroups: 26,
					groupRange: 4,
					attachments: 8,
					fontSize,
					groupSpacing,
				});
	}, [compact, fontSize, groupSpacing]);
}
