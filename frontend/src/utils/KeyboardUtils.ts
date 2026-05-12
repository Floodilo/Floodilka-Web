/*
 * SPDX-License-Identifier: AGPL-3.0-or-later
 * Copyright (C) 2020-2026 Fluxer Contributors
 * Copyright (C) 2026 Floodilka Contributors
 * Modified by Floodilka Contributors starting March 2026. See LICENSE and NOTICE.
 */

import type React from 'react';

export const SHIFT_KEY_SYMBOL = '⇧';

export function stopPropagationOnEnterSpace(e: React.KeyboardEvent) {
	if (e.key === 'Enter' || e.key === ' ') {
		e.stopPropagation();
	}
}
