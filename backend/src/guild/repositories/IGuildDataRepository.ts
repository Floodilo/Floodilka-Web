/*
 * SPDX-License-Identifier: AGPL-3.0-or-later
 * Copyright (C) 2020-2026 Fluxer Contributors
 * Copyright (C) 2026 Floodilka Contributors
 * Modified by Floodilka Contributors starting March 2026. See LICENSE and NOTICE.
 */

import type {GuildID, UserID} from '~/BrandedTypes';
import type {GuildRow} from '~/database/CassandraTypes';
import type {Guild} from '~/Models';

export abstract class IGuildDataRepository {
	abstract findUnique(guildId: GuildID): Promise<Guild | null>;
	abstract listGuilds(guildIds: Array<GuildID>): Promise<Array<Guild>>;
	abstract listAllGuildsPaginated(limit: number, lastGuildId?: GuildID): Promise<Array<Guild>>;
	abstract listUserGuilds(userId: UserID): Promise<Array<Guild>>;
	abstract countUserGuilds(userId: UserID): Promise<number>;
	abstract listOwnedGuildIds(userId: UserID): Promise<Array<GuildID>>;
	abstract upsert(data: GuildRow): Promise<Guild>;
	abstract delete(guildId: GuildID): Promise<void>;
}
