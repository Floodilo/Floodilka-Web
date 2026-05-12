/*
 * SPDX-License-Identifier: AGPL-3.0-or-later
 * Copyright (C) 2020-2026 Fluxer Contributors
 * Copyright (C) 2026 Floodilka Contributors
 * Modified by Floodilka Contributors starting March 2026. See LICENSE and NOTICE.
 */

import type {FC, SVGProps} from 'react';
import {MODE} from '~/lib/env';
import {Platform} from '~/lib/Platform';

export type TwemojiComponent = FC<SVGProps<SVGSVGElement>>;

const TWEMOJI_CDN = 'https://static.floodilka.com/emoji';

export const shouldUseNativeEmoji = Platform.isAppleDevice;

export const convertToCodePoints = (emoji: string): string => {
	const containsZWJ = emoji.includes('\u200D');
	const processedEmoji = containsZWJ ? emoji : emoji.replace(/\uFE0F/g, '');
	return Array.from(processedEmoji)
		.map((char) => char.codePointAt(0)?.toString(16).replace(/^0+/, '') || '')
		.join('-');
};

export const fromHexCodePoint = (hex: string): string => String.fromCodePoint(Number.parseInt(hex, 16));

export const getTwemojiURL = (codePoints: string): string | null => {
	if (shouldUseNativeEmoji || MODE === 'test' || !codePoints) {
		return null;
	}

	return `${TWEMOJI_CDN}/${codePoints}.svg`;
};

export const getEmojiURL = (unicode: string): string | null => getTwemojiURL(convertToCodePoints(unicode));

export const getTwemojiSvg = (_codePoints: string): TwemojiComponent | null => null;
export const getEmojiSvg = (_unicode: string): TwemojiComponent | null => null;
