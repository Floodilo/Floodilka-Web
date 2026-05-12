/*
 * SPDX-License-Identifier: AGPL-3.0-or-later
 * Copyright (C) 2020-2026 Fluxer Contributors
 * Copyright (C) 2026 Floodilka Contributors
 * Modified by Floodilka Contributors starting March 2026. See LICENSE and NOTICE.
 */

const HIGHLIGHT_NAME = 'channel-search-highlight';

function isHighlightAPISupported(): boolean {
	return typeof CSS !== 'undefined' && 'highlights' in CSS;
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

function createRangesForSearchTerms(textNodes: Array<Text>, searchTerms: Array<string>): Array<Range> {
	const ranges: Array<Range> = [];

	const cleanTerms = searchTerms.map((term) => term.trim().toLowerCase()).filter((term) => term.length > 0);

	if (cleanTerms.length === 0) return ranges;

	for (const textNode of textNodes) {
		const text = textNode.textContent || '';
		const lowerText = text.toLowerCase();

		for (const term of cleanTerms) {
			let startPos = 0;
			while (startPos < lowerText.length) {
				const index = lowerText.indexOf(term, startPos);
				if (index === -1) break;

				const range = new Range();
				range.setStart(textNode, index);
				range.setEnd(textNode, index + term.length);
				ranges.push(range);

				startPos = index + term.length;
			}
		}
	}

	return ranges;
}

export function applyChannelSearchHighlight(container: HTMLElement, searchTerms: Array<string>): void {
	if (!isHighlightAPISupported()) return;

	CSS.highlights.delete(HIGHLIGHT_NAME);

	if (searchTerms.length === 0) return;

	const textNodes = findAllTextNodes(container);
	const ranges = createRangesForSearchTerms(textNodes, searchTerms);

	if (ranges.length === 0) return;

	const highlight = new Highlight(...ranges);
	CSS.highlights.set(HIGHLIGHT_NAME, highlight);
}

export function clearChannelSearchHighlight(): void {
	if (!isHighlightAPISupported()) return;
	CSS.highlights.delete(HIGHLIGHT_NAME);
}
