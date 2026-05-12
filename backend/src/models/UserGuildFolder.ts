/*
 * SPDX-License-Identifier: AGPL-3.0-or-later
 * Copyright (C) 2020-2026 Fluxer Contributors
 * Copyright (C) 2026 Floodilka Contributors
 * Modified by Floodilka Contributors starting March 2026. See LICENSE and NOTICE.
 */

import type {GuildFolder} from '~/database/CassandraTypes';
import type {GuildID} from '../BrandedTypes';

export class UserGuildFolder {
	readonly folderId: number;
	readonly name: string | null;
	readonly color: number | null;
	readonly flags: number;
	readonly icon: string;
	readonly guildIds: Array<GuildID>;

	constructor(folder: GuildFolder) {
		this.folderId = folder.folder_id;
		this.name = folder.name ?? null;
		this.color = folder.color ?? null;
		this.flags = folder.flags ?? 0;
		this.icon = folder.icon ?? 'folder';
		this.guildIds = folder.guild_ids ?? [];
	}

	toGuildFolder(): GuildFolder {
		return {
			folder_id: this.folderId,
			name: this.name,
			color: this.color,
			flags: this.flags,
			icon: this.icon,
			guild_ids: this.guildIds.length > 0 ? this.guildIds : null,
		};
	}
}
