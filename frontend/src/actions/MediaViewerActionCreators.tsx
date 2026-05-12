/*
 * SPDX-License-Identifier: AGPL-3.0-or-later
 * Copyright (C) 2020-2026 Fluxer Contributors
 * Copyright (C) 2026 Floodilka Contributors
 * Modified by Floodilka Contributors starting March 2026. See LICENSE and NOTICE.
 */

import type {MessageRecord} from '~/records/MessageRecord';
import MediaViewerStore, {type MediaViewerItem} from '~/stores/MediaViewerStore';

export function openMediaViewer(
	items: ReadonlyArray<MediaViewerItem>,
	currentIndex: number,
	options?: {
		channelId?: string;
		messageId?: string;
		message?: MessageRecord;
	},
): void {
	MediaViewerStore.open(items, currentIndex, options?.channelId, options?.messageId, options?.message);
}

export function closeMediaViewer(): void {
	MediaViewerStore.close();
}

export function navigateMediaViewer(index: number): void {
	MediaViewerStore.navigate(index);
}
