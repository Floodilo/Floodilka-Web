/*
 * SPDX-License-Identifier: AGPL-3.0-or-later
 * Copyright (C) 2020-2026 Fluxer Contributors
 * Copyright (C) 2026 Floodilka Contributors
 * Modified by Floodilka Contributors starting March 2026. See LICENSE and NOTICE.
 */

import type {GuildID, UserID} from '~/BrandedTypes';
import type {UserRow} from '~/database/CassandraTypes';
import type {User} from '~/Models';

export interface IUserAccountRepository {
	create(data: UserRow): Promise<User>;
	upsert(data: UserRow, oldData?: UserRow | null): Promise<User>;
	patchUpsert(userId: UserID, patchData: Partial<UserRow>, oldData?: UserRow | null): Promise<User | null>;
	findUnique(userId: UserID): Promise<User | null>;
	findUniqueAssert(userId: UserID): Promise<User>;
	findByUsername(username: string): Promise<User | null>;
	findByEmail(email: string): Promise<User | null>;
	findByPhone(phone: string): Promise<User | null>;
	findByCloudpaymentsSubscriptionId(cloudpaymentsSubscriptionId: string): Promise<User | null>;
	listUsers(userIds: Array<UserID>): Promise<Array<User>>;
	listAllUsersPaginated(limit: number, lastUserId?: UserID): Promise<Array<User>>;

	getUserGuildIds(userId: UserID): Promise<Array<GuildID>>;

	addPendingDeletion(userId: UserID, pendingDeletionAt: Date, deletionReasonCode: number): Promise<void>;
	removePendingDeletion(userId: UserID, pendingDeletionAt: Date): Promise<void>;
	findUsersPendingDeletion(now: Date): Promise<Array<User>>;
	findUsersPendingDeletionByDate(deletionDate: string): Promise<Array<{user_id: bigint; deletion_reason_code: number}>>;
	isUserPendingDeletion(userId: UserID, deletionDate: string): Promise<boolean>;
	scheduleDeletion(userId: UserID, pendingDeletionAt: Date, deletionReasonCode: number): Promise<void>;

	deleteUserSecondaryIndices(userId: UserID): Promise<void>;
	removeFromAllGuilds(userId: UserID): Promise<void>;

	updateLastActiveAt(params: {userId: UserID; lastActiveAt: Date; lastActiveIp?: string}): Promise<void>;
}
