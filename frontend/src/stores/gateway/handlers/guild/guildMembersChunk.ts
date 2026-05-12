/*
 * SPDX-License-Identifier: AGPL-3.0-or-later
 * Copyright (C) 2020-2026 Fluxer Contributors
 * Copyright (C) 2026 Floodilka Contributors
 * Modified by Floodilka Contributors starting March 2026. See LICENSE and NOTICE.
 */

import type {GuildMember} from '~/records/GuildMemberRecord';
import {GuildMemberRecord} from '~/records/GuildMemberRecord';
import type {User} from '~/records/UserRecord';
import GuildMemberStore from '~/stores/GuildMemberStore';
import MemberSearchStore from '~/stores/MemberSearchStore';
import PresenceStore, {type Presence} from '~/stores/PresenceStore';
import UserStore from '~/stores/UserStore';
import type {GatewayHandlerContext} from '../index';

interface GuildMembersChunkPayload {
	guild_id: string;
	members: ReadonlyArray<GuildMember>;
	chunk_index: number;
	chunk_count: number;
	not_found?: ReadonlyArray<string>;
	presences?: ReadonlyArray<Presence>;
	nonce?: string;
}

export function handleGuildMembersChunk(data: GuildMembersChunkPayload, _context: GatewayHandlerContext): void {
	const {guild_id: guildId, members, chunk_index: chunkIndex, chunk_count: chunkCount, presences, nonce} = data;

	for (const member of members) {
		UserStore.handleUserUpdate(member.user as User);
	}

	GuildMemberStore.handleMembersChunk({
		guildId,
		members: members as Array<GuildMember>,
		chunkIndex,
		chunkCount,
		nonce,
	});

	const memberRecords = members.map((member) => new GuildMemberRecord(guildId, member));
	MemberSearchStore.handleMembersChunk(guildId, memberRecords);

	if (presences) {
		for (const presence of presences) {
			PresenceStore.handlePresenceUpdate(presence);
		}
	}
}
