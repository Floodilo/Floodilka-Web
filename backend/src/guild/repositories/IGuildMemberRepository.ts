/*
 * SPDX-License-Identifier: AGPL-3.0-or-later
 * Copyright (C) 2020-2026 Fluxer Contributors
 * Copyright (C) 2026 Floodilka Contributors
 * Modified by Floodilka Contributors starting March 2026. See LICENSE and NOTICE.
 */

import type {GuildID, UserID} from '~/BrandedTypes';
import type {GuildMemberRow} from '~/database/CassandraTypes';
import type {GuildMember} from '~/Models';

export abstract class IGuildMemberRepository {
	abstract getMember(guildId: GuildID, userId: UserID): Promise<GuildMember | null>;
	abstract listMembers(guildId: GuildID): Promise<Array<GuildMember>>;
	abstract upsertMember(data: GuildMemberRow): Promise<GuildMember>;
	abstract deleteMember(guildId: GuildID, userId: UserID): Promise<void>;
}
