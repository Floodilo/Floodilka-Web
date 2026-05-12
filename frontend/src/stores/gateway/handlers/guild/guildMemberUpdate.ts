/*
 * SPDX-License-Identifier: AGPL-3.0-or-later
 * Copyright (C) 2020-2026 Fluxer Contributors
 * Copyright (C) 2026 Floodilka Contributors
 * Modified by Floodilka Contributors starting March 2026. See LICENSE and NOTICE.
 */

import type {GuildMember} from '~/records/GuildMemberRecord';
import type {User} from '~/records/UserRecord';
import EmojiStore from '~/stores/EmojiStore';
import GuildMemberStore from '~/stores/GuildMemberStore';
import GuildReadStateStore from '~/stores/GuildReadStateStore';
import GuildVerificationStore from '~/stores/GuildVerificationStore';
import MemberSearchStore from '~/stores/MemberSearchStore';
import MessageStore from '~/stores/MessageStore';
import PermissionStore from '~/stores/PermissionStore';
import PresenceStore from '~/stores/PresenceStore';
import UserStore from '~/stores/UserStore';
import type {GatewayHandlerContext} from '../index';

interface GuildMemberUpdatePayload extends GuildMember {
	guild_id: string;
}

export function handleGuildMemberUpdate(data: GuildMemberUpdatePayload, _context: GatewayHandlerContext): void {
	UserStore.handleUserUpdate(data.user as User);
	GuildMemberStore.handleMemberAdd(data.guild_id, data);
	PermissionStore.handleGuildMemberUpdate(data.user.id);
	GuildReadStateStore.handleGuildMemberUpdate(data.user.id, data.guild_id);
	PresenceStore.handleGuildMemberUpdate(data.guild_id, data.user.id);
	MessageStore.handleGuildMemberUpdate({
		type: 'GUILD_MEMBER_UPDATE',
		guildId: data.guild_id,
		member: data,
	});
	EmojiStore.handleGuildMemberUpdate({guildId: data.guild_id, member: data});
	GuildVerificationStore.handleGuildMemberUpdate(data.guild_id);
	MemberSearchStore.handleMemberUpdate(data.guild_id, data.user.id);
}
