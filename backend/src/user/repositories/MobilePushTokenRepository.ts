/*
 * SPDX-License-Identifier: AGPL-3.0-or-later
 * Copyright (C) 2020-2026 Fluxer Contributors
 * Copyright (C) 2026 Floodilka Contributors
 * Modified by Floodilka Contributors starting March 2026. See LICENSE and NOTICE.
 */

import crypto from 'node:crypto';
import type {UserID} from '~/BrandedTypes';
import {deleteOneOrMany, fetchMany, prepared, upsertOne} from '~/database/Cassandra';
import type {MobilePushTokenRow} from '~/database/CassandraTypes';
import {MobilePushToken} from '~/Models';
import {MobilePushTokens} from '~/Tables';

const FETCH_BULK_TOKENS_CQL = MobilePushTokens.selectCql({
	where: MobilePushTokens.where.in('user_id', 'user_ids'),
});

export function computeTokenId(token: string): string {
	return crypto.createHash('sha256').update(token).digest('hex').substring(0, 32);
}

export class MobilePushTokenRepository {
	async upsertToken(userId: UserID, token: string, platform: string): Promise<MobilePushToken> {
		const data: MobilePushTokenRow = {
			user_id: userId,
			token_id: computeTokenId(token),
			push_token: token,
			platform,
			created_at: new Date(),
		};
		await upsertOne(MobilePushTokens.upsertAll(data));
		return new MobilePushToken(data);
	}

	async deleteToken(userId: UserID, tokenId: string): Promise<void> {
		await deleteOneOrMany(MobilePushTokens.deleteByPk({user_id: userId, token_id: tokenId}));
	}

	async deleteTokenByValue(userId: UserID, token: string): Promise<void> {
		await this.deleteToken(userId, computeTokenId(token));
	}

	async getBulkTokens(userIds: Array<UserID>): Promise<Map<UserID, Array<MobilePushToken>>> {
		if (userIds.length === 0) return new Map();

		const rows = await fetchMany<MobilePushTokenRow>(FETCH_BULK_TOKENS_CQL, {user_ids: userIds});

		const map = new Map<UserID, Array<MobilePushToken>>();
		for (const row of rows) {
			const mobilePushToken = new MobilePushToken(row);
			const existing = map.get(row.user_id) ?? [];
			existing.push(mobilePushToken);
			map.set(row.user_id, existing);
		}
		return map;
	}

	async deleteAllTokens(userId: UserID): Promise<void> {
		await deleteOneOrMany(
			prepared(MobilePushTokens.deleteCql({where: MobilePushTokens.where.eq('user_id')}), {user_id: userId}),
		);
	}
}
