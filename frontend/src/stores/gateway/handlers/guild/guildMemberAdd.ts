/*
 * SPDX-License-Identifier: AGPL-3.0-or-later
 * Copyright (C) 2020-2026 Fluxer Contributors
 * Copyright (C) 2026 Floodilka Contributors
 * Modified by Floodilka Contributors starting March 2026. See LICENSE and NOTICE.
 */

import type {GuildMember} from '~/records/GuildMemberRecord';
import type {User} from '~/records/UserRecord';
import GuildMemberStore from '~/stores/GuildMemberStore';
import MemberSearchStore from '~/stores/MemberSearchStore';
import PresenceStore from '~/stores/PresenceStore';
import UserStore from '~/stores/UserStore';
import type {GatewayHandlerContext} from '../index';

interface GuildMemberAddPayload extends GuildMember {
	guild_id: string;
}

export function handleGuildMemberAdd(data: GuildMemberAddPayload, _context: GatewayHandlerContext): void {
	UserStore.handleUserUpdate(data.user as User);
	GuildMemberStore.handleMemberAdd(data.guild_id, data);
	PresenceStore.handleGuildMemberAdd(data.guild_id, data.user.id);
	MemberSearchStore.handleMemberAdd(data.guild_id, data.user.id);
}
