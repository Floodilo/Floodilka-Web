/*
 * SPDX-License-Identifier: AGPL-3.0-or-later
 * Copyright (C) 2020-2026 Fluxer Contributors
 * Copyright (C) 2026 Floodilka Contributors
 * Modified by Floodilka Contributors starting March 2026. See LICENSE and NOTICE.
 */

import type {Invite} from '~/records/MessageRecord';
import InviteStore from '~/stores/InviteStore';
import type {GatewayHandlerContext} from '../index';

export function handleInviteCreate(data: Invite, _context: GatewayHandlerContext): void {
	InviteStore.handleInviteCreate(data);
}
