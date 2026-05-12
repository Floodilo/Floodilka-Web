/*
 * SPDX-License-Identifier: AGPL-3.0-or-later
 * Copyright (C) 2020-2026 Fluxer Contributors
 * Copyright (C) 2026 Floodilka Contributors
 * Modified by Floodilka Contributors starting March 2026. See LICENSE and NOTICE.
 */

import ChannelStore from '~/stores/ChannelStore';
import GuildMemberStore from '~/stores/GuildMemberStore';
import GuildReadStateStore from '~/stores/GuildReadStateStore';
import GuildStore from '~/stores/GuildStore';
import PermissionStore from '~/stores/PermissionStore';
import type {GatewayHandlerContext} from '../index';

interface GuildRoleDeletePayload {
	guild_id: string;
	role_id: string;
}

export function handleGuildRoleDelete(data: GuildRoleDeletePayload, _context: GatewayHandlerContext): void {
	GuildStore.handleGuildRoleDelete({guildId: data.guild_id, roleId: data.role_id});
	GuildMemberStore.handleGuildRoleDelete(data.guild_id, data.role_id);
	ChannelStore.handleGuildRoleDelete({guildId: data.guild_id, roleId: data.role_id});
	PermissionStore.handleGuildRole(data.guild_id);
	GuildReadStateStore.handleGuildUpdate(data.guild_id);
}
