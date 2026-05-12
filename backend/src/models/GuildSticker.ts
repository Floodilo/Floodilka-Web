/*
 * SPDX-License-Identifier: AGPL-3.0-or-later
 * Copyright (C) 2020-2026 Fluxer Contributors
 * Copyright (C) 2026 Floodilka Contributors
 * Modified by Floodilka Contributors starting March 2026. See LICENSE and NOTICE.
 */

import type {GuildStickerRow} from '~/database/CassandraTypes';
import type {GuildID, StickerID, UserID} from '../BrandedTypes';

export class GuildSticker {
	readonly guildId: GuildID;
	readonly id: StickerID;
	readonly name: string;
	readonly description: string | null;
	readonly formatType: number;
	readonly tags: Array<string>;
	readonly creatorId: UserID;
	readonly version: number;

	constructor(row: GuildStickerRow) {
		this.guildId = row.guild_id;
		this.id = row.sticker_id;
		this.name = row.name;
		this.description = row.description ?? null;
		this.formatType = row.format_type;
		this.tags = row.tags ?? [];
		this.creatorId = row.creator_id;
		this.version = row.version;
	}

	toRow(): GuildStickerRow {
		return {
			guild_id: this.guildId,
			sticker_id: this.id,
			name: this.name,
			description: this.description,
			format_type: this.formatType,
			tags: this.tags.length > 0 ? this.tags : null,
			creator_id: this.creatorId,
			version: this.version,
		};
	}
}
