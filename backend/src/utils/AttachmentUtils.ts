/*
 * SPDX-License-Identifier: AGPL-3.0-or-later
 * Copyright (C) 2020-2026 Fluxer Contributors
 * Copyright (C) 2026 Floodilka Contributors
 * Modified by Floodilka Contributors starting March 2026. See LICENSE and NOTICE.
 */

import {Config} from '~/Config';
import {ATTACHMENT_MAX_SIZE_NON_PREMIUM, ATTACHMENT_MAX_SIZE_PREMIUM} from '~/Constants';

export function getAttachmentMaxSize(isPremium: boolean): number {
	if (Config.instance.selfHosted) {
		return ATTACHMENT_MAX_SIZE_PREMIUM;
	}
	return isPremium ? ATTACHMENT_MAX_SIZE_PREMIUM : ATTACHMENT_MAX_SIZE_NON_PREMIUM;
}
