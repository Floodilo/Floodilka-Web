/*
 * SPDX-License-Identifier: AGPL-3.0-or-later
 * Copyright (C) 2020-2026 Fluxer Contributors
 * Copyright (C) 2026 Floodilka Contributors
 * Modified by Floodilka Contributors starting March 2026. See LICENSE and NOTICE.
 */

import UserPinnedDMStore from '~/stores/UserPinnedDMStore';
import type {GatewayHandlerContext} from '../index';

export function handleUserPinnedDmsUpdate(data: Array<string>, _context: GatewayHandlerContext): void {
	UserPinnedDMStore.setPinnedDMs(data);
}
