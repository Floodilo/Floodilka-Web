/*
 * SPDX-License-Identifier: AGPL-3.0-or-later
 * Copyright (C) 2020-2026 Fluxer Contributors
 * Copyright (C) 2026 Floodilka Contributors
 * Modified by Floodilka Contributors starting March 2026. See LICENSE and NOTICE.
 */

import {ACTIVE_RING_CONTEXT_MANAGER} from './FocusRingContext';

class FocusRingManagerClass {
	ringsEnabled = true;

	setRingsEnabled(enabled: boolean) {
		this.ringsEnabled = enabled;
		if (!enabled) {
			ACTIVE_RING_CONTEXT_MANAGER?.hide();
		}
	}
}

const FocusRingManager = new FocusRingManagerClass();

export default FocusRingManager;
