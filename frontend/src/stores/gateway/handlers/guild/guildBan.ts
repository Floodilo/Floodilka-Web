/*
 * SPDX-License-Identifier: AGPL-3.0-or-later
 * Copyright (C) 2020-2026 Fluxer Contributors
 * Copyright (C) 2026 Floodilka Contributors
 * Modified by Floodilka Contributors starting March 2026. See LICENSE and NOTICE.
 */

import type {UserPartial} from '~/records/UserRecord';
import type {GatewayHandlerContext} from '../index';

interface GuildBanPayload {
	guild_id: string;
	user: UserPartial;
}

export function handleGuildBan(_data: GuildBanPayload, _context: GatewayHandlerContext): void {}
