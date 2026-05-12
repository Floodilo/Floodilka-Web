/*
 * SPDX-License-Identifier: AGPL-3.0-or-later
 * Copyright (C) 2020-2026 Fluxer Contributors
 * Copyright (C) 2026 Floodilka Contributors
 * Modified by Floodilka Contributors starting March 2026. See LICENSE and NOTICE.
 */

import type {GuildID, RoleID} from '~/BrandedTypes';
import type {GuildRoleRow} from '~/database/CassandraTypes';
import type {GuildRole} from '~/Models';

export abstract class IGuildRoleRepository {
	abstract getRole(roleId: RoleID, guildId: GuildID): Promise<GuildRole | null>;
	abstract listRoles(guildId: GuildID): Promise<Array<GuildRole>>;
	abstract listRolesByIds(roleIds: Array<RoleID>, guildId: GuildID): Promise<Array<GuildRole>>;
	abstract countRoles(guildId: GuildID): Promise<number>;
	abstract upsertRole(data: GuildRoleRow): Promise<GuildRole>;
	abstract deleteRole(guildId: GuildID, roleId: RoleID): Promise<void>;
}
