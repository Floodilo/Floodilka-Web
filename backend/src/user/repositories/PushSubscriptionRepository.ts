/*
 * SPDX-License-Identifier: AGPL-3.0-or-later
 * Copyright (C) 2020-2026 Fluxer Contributors
 * Copyright (C) 2026 Floodilka Contributors
 * Modified by Floodilka Contributors starting March 2026. See LICENSE and NOTICE.
 */

import type {UserID} from '~/BrandedTypes';
import {deleteOneOrMany, fetchMany, prepared, upsertOne} from '~/database/Cassandra';
import type {PushSubscriptionRow} from '~/database/CassandraTypes';
import {PushSubscription} from '~/Models';
import {PushSubscriptions} from '~/Tables';

const FETCH_PUSH_SUBSCRIPTIONS_CQL = PushSubscriptions.selectCql({
	where: PushSubscriptions.where.eq('user_id'),
});

const FETCH_BULK_PUSH_SUBSCRIPTIONS_CQL = PushSubscriptions.selectCql({
	where: PushSubscriptions.where.in('user_id', 'user_ids'),
});

export class PushSubscriptionRepository {
	async listPushSubscriptions(userId: UserID): Promise<Array<PushSubscription>> {
		const rows = await fetchMany<PushSubscriptionRow>(FETCH_PUSH_SUBSCRIPTIONS_CQL, {user_id: userId});
		return rows.map((row) => new PushSubscription(row));
	}

	async createPushSubscription(data: PushSubscriptionRow): Promise<PushSubscription> {
		await upsertOne(PushSubscriptions.upsertAll(data));
		return new PushSubscription(data);
	}

	async deletePushSubscription(userId: UserID, subscriptionId: string): Promise<void> {
		await deleteOneOrMany(PushSubscriptions.deleteByPk({user_id: userId, subscription_id: subscriptionId}));
	}

	async getBulkPushSubscriptions(userIds: Array<UserID>): Promise<Map<UserID, Array<PushSubscription>>> {
		if (userIds.length === 0) return new Map();

		const rows = await fetchMany<PushSubscriptionRow>(FETCH_BULK_PUSH_SUBSCRIPTIONS_CQL, {user_ids: userIds});

		const map = new Map<UserID, Array<PushSubscription>>();
		for (const row of rows) {
			const sub = new PushSubscription(row);
			const existing = map.get(row.user_id) ?? [];
			existing.push(sub);
			map.set(row.user_id, existing);
		}
		return map;
	}

	async deleteAllPushSubscriptions(userId: UserID): Promise<void> {
		await deleteOneOrMany(
			prepared(PushSubscriptions.deleteCql({where: PushSubscriptions.where.eq('user_id')}), {user_id: userId}),
		);
	}
}
