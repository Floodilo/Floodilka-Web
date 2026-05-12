/*
 * SPDX-License-Identifier: AGPL-3.0-or-later
 * Copyright (C) 2020-2026 Fluxer Contributors
 * Copyright (C) 2026 Floodilka Contributors
 * Modified by Floodilka Contributors starting March 2026. See LICENSE and NOTICE.
 */

import {getBestContrastColor} from '~/utils/ColorUtils';

const DEFAULT_NOTCH_COLOR = 'rgba(255, 255, 255, 0.6)';
const DARK_NOTCH_COLOR = 'rgba(0, 0, 0, 0.4)';
const LIGHT_NOTCH_COLOR = 'rgba(255, 255, 255, 0.7)';

export const getContrastingNotchColor = (bannerColor?: number | null, hasBanner?: boolean): string => {
	if (!hasBanner || bannerColor == null) {
		return DEFAULT_NOTCH_COLOR;
	}

	return getBestContrastColor(bannerColor) === 'black' ? DARK_NOTCH_COLOR : LIGHT_NOTCH_COLOR;
};
