/*
 * SPDX-License-Identifier: AGPL-3.0-or-later
 * Copyright (C) 2020-2026 Fluxer Contributors
 * Copyright (C) 2026 Floodilka Contributors
 * Modified by Floodilka Contributors starting March 2026. See LICENSE and NOTICE.
 */

import {openExternalUrl} from '~/utils/NativeUtils';

type MediaType = 'image' | 'video' | 'audio' | 'file';

export const downloadFile = async (src: string, _type: MediaType, _providedFilename?: string) => {
	if (!src) return;
	await openExternalUrl(src);
};

export const createSaveHandler = (src: string, type: MediaType, providedFilename?: string) => async () => {
	await downloadFile(src, type, providedFilename);
};
