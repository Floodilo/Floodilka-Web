/*
 * SPDX-License-Identifier: AGPL-3.0-or-later
 * Copyright (C) 2020-2026 Fluxer Contributors
 * Copyright (C) 2026 Floodilka Contributors
 * Modified by Floodilka Contributors starting March 2026. See LICENSE and NOTICE.
 */

import type {GuildRole} from '~/records/GuildRoleRecord';
import GuildReadStateStore from '~/stores/GuildReadStateStore';
import GuildStore from '~/stores/GuildStore';
import PermissionStore from '~/stores/PermissionStore';
import type {GatewayHandlerContext} from '../index';

interface GuildRoleUpdateBulkPayload {
	guild_id: string;
	roles: Array<GuildRole>;
}

export function handleGuildRoleUpdateBulk(data: GuildRoleUpdateBulkPayload, _context: GatewayHandlerContext): void {
	if (data.roles.length > 0) {
		GuildStore.handleGuildRoleUpdateBulk({guildId: data.guild_id, roles: data.roles});
	}

	PermissionStore.handleGuildRole(data.guild_id);
	GuildReadStateStore.handleGuildUpdate(data.guild_id);
}
