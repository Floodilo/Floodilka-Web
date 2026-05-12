/*
 * SPDX-License-Identifier: AGPL-3.0-or-later
 * Copyright (C) 2020-2026 Fluxer Contributors
 * Copyright (C) 2026 Floodilka Contributors
 * Modified by Floodilka Contributors starting March 2026. See LICENSE and NOTICE.
 */

import type {UserID} from '~/BrandedTypes';
import type {RelationshipRow} from '~/database/CassandraTypes';
import type {Relationship, UserNote} from '~/Models';

export interface IUserRelationshipRepository {
	listRelationships(sourceUserId: UserID): Promise<Array<Relationship>>;
	getRelationship(sourceUserId: UserID, targetUserId: UserID, type: number): Promise<Relationship | null>;
	upsertRelationship(relationship: RelationshipRow): Promise<Relationship>;
	deleteRelationship(sourceUserId: UserID, targetUserId: UserID, type: number): Promise<void>;
	deleteAllRelationships(userId: UserID): Promise<void>;

	getUserNote(sourceUserId: UserID, targetUserId: UserID): Promise<UserNote | null>;
	getUserNotes(sourceUserId: UserID): Promise<Map<UserID, string>>;
	upsertUserNote(sourceUserId: UserID, targetUserId: UserID, note: string): Promise<UserNote>;
	clearUserNote(sourceUserId: UserID, targetUserId: UserID): Promise<void>;
	deleteAllNotes(userId: UserID): Promise<void>;
}
