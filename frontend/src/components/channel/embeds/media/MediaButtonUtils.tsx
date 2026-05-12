/*
 * SPDX-License-Identifier: AGPL-3.0-or-later
 * Copyright (C) 2020-2026 Fluxer Contributors
 * Copyright (C) 2026 Floodilka Contributors
 * Modified by Floodilka Contributors starting March 2026. See LICENSE and NOTICE.
 */

import {canDeleteAttachmentUtil} from '~/components/channel/messageActionUtils';
import type {MessageRecord} from '~/records/MessageRecord';
import AccessibilityStore from '~/stores/AccessibilityStore';

export interface MediaButtonVisibilityOptions {
	disableDelete?: boolean;
}

export interface MediaButtonVisibility {
	showFavoriteButton: boolean;
	showDownloadButton: boolean;
	showDeleteButton: boolean;
}

export function getMediaButtonVisibility(
	canFavorite: boolean,
	message?: MessageRecord,
	attachmentId?: string,
	options?: MediaButtonVisibilityOptions,
): MediaButtonVisibility {
	const showMediaFavoriteButton = AccessibilityStore.showMediaFavoriteButton;
	const showMediaDownloadButton = AccessibilityStore.showMediaDownloadButton;
	const showMediaDeleteButton = AccessibilityStore.showMediaDeleteButton;
	const disableDelete = options?.disableDelete ?? false;

	return {
		showFavoriteButton: showMediaFavoriteButton && canFavorite,
		showDownloadButton: showMediaDownloadButton,
		showDeleteButton:
			showMediaDeleteButton && !disableDelete && !!(message && attachmentId && canDeleteAttachmentUtil(message)),
	};
}
