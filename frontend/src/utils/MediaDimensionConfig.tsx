/*
 * SPDX-License-Identifier: AGPL-3.0-or-later
 * Copyright (C) 2020-2026 Fluxer Contributors
 * Copyright (C) 2026 Floodilka Contributors
 * Modified by Floodilka Contributors starting March 2026. See LICENSE and NOTICE.
 */

import {MessageFlags} from '~/Constants';
import type {MessageRecord} from '~/records/MessageRecord';
import AccessibilityStore, {MediaDimensionSize} from '~/stores/AccessibilityStore';

export interface MediaDimensions {
	maxWidth: number;
	maxHeight: number;
}

const DIMENSION_PRESETS = {
	SMALL: {
		maxWidth: 400,
		maxHeight: 300,
	},
	LARGE: {
		maxWidth: 550,
		maxHeight: 400,
	},
} as const;

export const getAttachmentMediaDimensions = (message?: MessageRecord): MediaDimensions => {
	if (message && (message.flags & MessageFlags.COMPACT_ATTACHMENTS) !== 0) {
		return DIMENSION_PRESETS.SMALL;
	}

	const size = AccessibilityStore.attachmentMediaDimensionSize;
	return size === MediaDimensionSize.SMALL ? DIMENSION_PRESETS.SMALL : DIMENSION_PRESETS.LARGE;
};

export const getEmbedMediaDimensions = (): MediaDimensions => {
	const size = AccessibilityStore.embedMediaDimensionSize;
	return size === MediaDimensionSize.SMALL ? DIMENSION_PRESETS.SMALL : DIMENSION_PRESETS.LARGE;
};

export const getMosaicMediaDimensions = (message?: MessageRecord): MediaDimensions => {
	return getAttachmentMediaDimensions(message);
};
