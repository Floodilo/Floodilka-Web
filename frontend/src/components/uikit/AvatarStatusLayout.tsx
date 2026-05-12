/*
 * SPDX-License-Identifier: AGPL-3.0-or-later
 * Copyright (C) 2020-2026 Fluxer Contributors
 * Copyright (C) 2026 Floodilka Contributors
 * Modified by Floodilka Contributors starting March 2026. See LICENSE and NOTICE.
 */

import {getStatusGeometry} from '~/components/uikit/AvatarStatusGeometry';

const TYPING_WIDTH_MULTIPLIER = 1.8;

export interface AvatarStatusLayout {
	supportsStatus: boolean;
	statusSize: number;
	borderSize: number;
	statusWidth: number;
	statusHeight: number;
	typingWidth: number;
	typingHeight: number;
	innerStatusWidth: number;
	innerStatusHeight: number;
	innerTypingWidth: number;
	innerTypingHeight: number;
	statusRight: number;
	statusBottom: number;
	typingRight: number;
	innerStatusRight: number;
	innerStatusBottom: number;
	innerTypingRight: number;
	innerTypingBottom: number;
	cutoutCx: number;
	cutoutCy: number;
	cutoutRadius: number;
	typingCutoutCx: number;
	typingCutoutCy: number;
	typingCutoutWidth: number;
	typingCutoutHeight: number;
	typingCutoutRx: number;
}

export function getAvatarStatusLayout(size: number, isMobile: boolean = false): AvatarStatusLayout {
	const supportsStatus = size > 16;
	const geom = getStatusGeometry(size, isMobile);

	const statusSize = geom.size;
	const borderSize = geom.borderWidth;

	const statusWidth = statusSize;
	const statusHeight = isMobile && geom.phoneHeight ? geom.phoneHeight : statusSize;

	const typingWidth = Math.round(statusSize * TYPING_WIDTH_MULTIPLIER);
	const typingHeight = statusSize;

	const innerStatusWidth = statusSize;
	const innerStatusHeight = isMobile && geom.phoneHeight ? geom.phoneHeight : statusSize;
	const innerTypingWidth = typingWidth;
	const innerTypingHeight = typingHeight;

	const cutoutCx = geom.cx;
	const cutoutCy = geom.cy;
	const cutoutRadius = geom.radius;

	const typingCutoutWidth = typingWidth;
	const typingCutoutHeight = typingHeight;

	const typingCutoutCx = cutoutCx + statusSize / 2 - typingWidth / 2;
	const typingCutoutCy = cutoutCy;
	const typingCutoutRx = geom.radius;

	const innerStatusRight = size - cutoutCx - statusSize / 2;
	const innerStatusBottom = size - cutoutCy - statusHeight / 2;
	const innerTypingRight = innerStatusRight;
	const innerTypingBottom = size - cutoutCy - typingHeight / 2;

	const statusRight = innerStatusRight;
	const statusBottom = innerStatusBottom;
	const typingRight = innerTypingRight;

	return {
		supportsStatus,
		statusSize,
		borderSize,
		statusWidth,
		statusHeight,
		typingWidth,
		typingHeight,
		innerStatusWidth,
		innerStatusHeight,
		innerTypingWidth,
		innerTypingHeight,
		statusRight,
		statusBottom,
		typingRight,
		innerStatusRight,
		innerStatusBottom,
		innerTypingRight,
		innerTypingBottom,
		cutoutCx,
		cutoutCy,
		cutoutRadius,
		typingCutoutCx,
		typingCutoutCy,
		typingCutoutWidth,
		typingCutoutHeight,
		typingCutoutRx,
	};
}
