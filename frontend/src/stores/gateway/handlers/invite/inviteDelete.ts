/*
 * SPDX-License-Identifier: AGPL-3.0-or-later
 * Copyright (C) 2020-2026 Fluxer Contributors
 * Copyright (C) 2026 Floodilka Contributors
 * Modified by Floodilka Contributors starting March 2026. See LICENSE and NOTICE.
 */

import InviteStore from '~/stores/InviteStore';
import type {GatewayHandlerContext} from '../index';

interface InviteDeletePayload {
	code: string;
	guild_id: string;
}

export function handleInviteDelete(data: InviteDeletePayload, _context: GatewayHandlerContext): void {
	InviteStore.handleInviteDelete(data.code);
}
