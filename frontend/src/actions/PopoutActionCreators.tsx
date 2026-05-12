/*
 * SPDX-License-Identifier: AGPL-3.0-or-later
 * Copyright (C) 2020-2026 Fluxer Contributors
 * Copyright (C) 2026 Floodilka Contributors
 * Modified by Floodilka Contributors starting March 2026. See LICENSE and NOTICE.
 */

import type {Popout} from '~/components/uikit/Popout';
import PopoutStore from '~/stores/PopoutStore';

export const open = (popout: Popout): void => {
	PopoutStore.open(popout);
};

export const close = (key?: string | number): void => {
	PopoutStore.close(key);
};

export const closeAll = (): void => {
	PopoutStore.closeAll();
};
