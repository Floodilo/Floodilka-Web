/*
 * SPDX-License-Identifier: AGPL-3.0-or-later
 * Copyright (C) 2020-2026 Fluxer Contributors
 * Copyright (C) 2026 Floodilka Contributors
 * Modified by Floodilka Contributors starting March 2026. See LICENSE and NOTICE.
 */

import {NodeType, TimestampStyle} from '../types/enums';
import type {ParserResult} from '../types/nodes';

const LESS_THAN = 60;
const LETTER_T = 116;
const COLON = 58;

export function parseTimestamp(text: string): ParserResult | null {
	if (
		text.length < 4 ||
		text.charCodeAt(0) !== LESS_THAN ||
		text.charCodeAt(1) !== LETTER_T ||
		text.charCodeAt(2) !== COLON
	) {
		return null;
	}

	const end = text.indexOf('>');
	if (end === -1) {
		return null;
	}

	const inner = text.slice(3, end);

	const allParts = inner.split(':');
	if (allParts.length > 2) {
		return null;
	}

	const [timestampPart, stylePart] = allParts;

	if (!/^\d+$/.test(timestampPart)) {
		return null;
	}

	const timestamp = Number(timestampPart);

	if (timestamp === 0) {
		return null;
	}

	let style: TimestampStyle;
	if (stylePart !== undefined) {
		if (stylePart === '') {
			return null;
		}

		const styleChar = stylePart[0];

		const parsedStyle = getTimestampStyle(styleChar);

		if (!parsedStyle) {
			return null;
		}

		style = parsedStyle;
	} else {
		style = TimestampStyle.ShortDateTime;
	}

	return {
		node: {
			type: NodeType.Timestamp,
			timestamp,
			style,
		},
		advance: end + 1,
	};
}

function getTimestampStyle(char: string): TimestampStyle | null {
	switch (char) {
		case 't':
			return TimestampStyle.ShortTime;
		case 'T':
			return TimestampStyle.LongTime;
		case 'd':
			return TimestampStyle.ShortDate;
		case 'D':
			return TimestampStyle.LongDate;
		case 'f':
			return TimestampStyle.ShortDateTime;
		case 'F':
			return TimestampStyle.LongDateTime;
		case 's':
			return TimestampStyle.ShortDateShortTime;
		case 'S':
			return TimestampStyle.ShortDateMediumTime;
		case 'R':
			return TimestampStyle.RelativeTime;
		default:
			return null;
	}
}
