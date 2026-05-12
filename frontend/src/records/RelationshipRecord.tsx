/*
 * SPDX-License-Identifier: AGPL-3.0-or-later
 * Copyright (C) 2020-2026 Fluxer Contributors
 * Copyright (C) 2026 Floodilka Contributors
 * Modified by Floodilka Contributors starting March 2026. See LICENSE and NOTICE.
 */

import type {UserPartial, UserRecord} from '~/records/UserRecord';
import UserStore from '~/stores/UserStore';

export type Relationship = Readonly<{
	id: string;
	type: number;
	user?: UserPartial;
	since: string;
	nickname?: string | null;
}>;

export class RelationshipRecord {
	readonly id: string;
	readonly type: number;
	readonly userId: string;
	readonly since: Date;
	readonly nickname: string | null;

	constructor(relationship: Relationship) {
		if (relationship.user) {
			UserStore.cacheUsers([relationship.user]);
			this.userId = relationship.user.id;
		} else {
			this.userId = relationship.id;
		}
		this.id = relationship.id;
		this.type = relationship.type;
		this.since = new Date(relationship.since);
		this.nickname = relationship.nickname ?? null;
	}

	get user(): UserRecord {
		return UserStore.getUser(this.userId)!;
	}

	withUpdates(relationship: Relationship): RelationshipRecord {
		const mergedUser = relationship.user
			? {
					...this.user?.toJSON(),
					...relationship.user,
				}
			: this.user?.toJSON();

		return new RelationshipRecord({
			id: relationship.id ?? this.id,
			type: relationship.type ?? this.type,
			since: relationship.since ?? this.since.toISOString(),
			nickname: relationship.nickname ?? this.nickname,
			user: mergedUser,
		});
	}
}
