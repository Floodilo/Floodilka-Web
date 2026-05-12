/*
 * SPDX-License-Identifier: AGPL-3.0-or-later
 * Copyright (C) 2020-2026 Fluxer Contributors
 * Copyright (C) 2026 Floodilka Contributors
 * Modified by Floodilka Contributors starting March 2026. See LICENSE and NOTICE.
 */

import type {UserPartial} from '~/records/UserRecord';
import GuildMemberStore from '~/stores/GuildMemberStore';
import PresenceStore from '~/stores/PresenceStore';
import UserStore from '~/stores/UserStore';
import type {GatewayHandlerContext} from '../index';

interface GuildMemberRemovePayload {
	guild_id: string;
	user: UserPartial;
}

export function handleGuildMemberRemove(data: GuildMemberRemovePayload, _context: GatewayHandlerContext): void {
	UserStore.handleUserUpdate(data.user);
	GuildMemberStore.handleMemberRemove(data.guild_id, data.user.id);
	PresenceStore.handleGuildMemberRemove(data.guild_id, data.user.id);
}
