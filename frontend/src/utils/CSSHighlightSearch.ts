/*
 * SPDX-License-Identifier: AGPL-3.0-or-later
 * Copyright (C) 2020-2026 Fluxer Contributors
 * Copyright (C) 2026 Floodilka Contributors
 * Modified by Floodilka Contributors starting March 2026. See LICENSE and NOTICE.
 */

const HIGHLIGHT_NAME = 'settings-search-highlight';

export function isHighlightAPISupported(): boolean {
	return typeof CSS !== 'undefined' && 'highlights' in CSS;
}

export function clearHighlights(): void {
	if (!isHighlightAPISupported()) return;
	CSS.highlights.clear();
}

function findAllTextNodes(container: HTMLElement): Array<Text> {
	const textNodes: Array<Text> = [];
	const walker = document.createTreeWalker(container, NodeFilter.SHOW_TEXT);

	let currentNode = walker.nextNode();
	while (currentNode) {
		const textNode = currentNode as Text;
		if (textNode.textContent && textNode.textContent.trim().length > 0) {
			textNodes.push(textNode);
		}
		currentNode = walker.nextNode();
	}

	return textNodes;
}

function createRangesForMatches(textNodes: Array<Text>, query: string): Array<Range> {
	const ranges: Array<Range> = [];
	const cleanQuery = query.trim().toLowerCase();

	if (!cleanQuery) return ranges;

	textNodes.forEach((textNode) => {
		const text = textNode.textContent || '';
		const lowerText = text.toLowerCase();

		let startPos = 0;
		while (startPos < lowerText.length) {
			const index = lowerText.indexOf(cleanQuery, startPos);
			if (index === -1) break;

			const range = new Range();
			range.setStart(textNode, index);
			range.setEnd(textNode, index + cleanQuery.length);
			ranges.push(range);

			startPos = index + cleanQuery.length;
		}
	});

	return ranges;
}

export function createRangesForSection(container: HTMLElement, query: string): Array<Range> {
	if (!isHighlightAPISupported()) {
		return [];
	}

	const cleanQuery = query.trim();
	if (!cleanQuery) {
		return [];
	}

	const textNodes = findAllTextNodes(container);
	return createRangesForMatches(textNodes, cleanQuery);
}

export function setHighlightRanges(ranges: Array<Range>): void {
	if (!isHighlightAPISupported()) return;

	CSS.highlights.clear();

	if (ranges.length === 0) {
		return;
	}

	const highlight = new Highlight(...ranges);
	CSS.highlights.set(HIGHLIGHT_NAME, highlight);
}
