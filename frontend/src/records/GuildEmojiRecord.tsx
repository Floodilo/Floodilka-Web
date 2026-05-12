/*
 * SPDX-License-Identifier: AGPL-3.0-or-later
 * Copyright (C) 2020-2026 Fluxer Contributors
 * Copyright (C) 2026 Floodilka Contributors
 * Modified by Floodilka Contributors starting March 2026. See LICENSE and NOTICE.
 */

import type {UserPartial} from '~/records/UserRecord';
import * as AvatarUtils from '~/utils/AvatarUtils';

export type GuildEmoji = Readonly<{
	id: string;
	name: string;
	animated: boolean;
	user?: UserPartial;
}>;

export interface GuildEmojiWithUser extends GuildEmoji {
	user?: UserPartial;
}

export class GuildEmojiRecord {
	readonly id: string;
	readonly guildId: string;
	readonly name: string;
	readonly uniqueName: string;
	readonly allNamesString: string;
	readonly url: string;
	readonly animated: boolean;
	readonly user?: UserPartial;

	constructor(guildId: string, data: GuildEmoji) {
		this.id = data.id;
		this.guildId = guildId;
		this.name = data.name;
		this.uniqueName = data.name;
		this.allNamesString = `:${data.name}:`;
		this.url = AvatarUtils.getEmojiURL({
			id: data.id,
			animated: data.animated,
		});
		this.animated = data.animated;
		this.user = data.user;
	}

	withUpdates(updates: Partial<GuildEmoji>): GuildEmojiRecord {
		return new GuildEmojiRecord(this.guildId, {
			id: updates.id ?? this.id,
			name: updates.name ?? this.name,
			animated: updates.animated ?? this.animated,
			user: updates.user ?? this.user,
		});
	}

	equals(other: GuildEmojiRecord): boolean {
		return (
			this.id === other.id &&
			this.guildId === other.guildId &&
			this.name === other.name &&
			this.animated === other.animated &&
			this.user?.id === other.user?.id
		);
	}

	toJSON(): GuildEmoji {
		return {
			id: this.id,
			name: this.name,
			animated: this.animated,
			user: this.user,
		};
	}

	static create(guildId: string, data: GuildEmoji): GuildEmojiRecord {
		return new GuildEmojiRecord(guildId, data);
	}
}
