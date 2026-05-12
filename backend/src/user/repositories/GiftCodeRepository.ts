/*
 * SPDX-License-Identifier: AGPL-3.0-or-later
 * Copyright (C) 2020-2026 Fluxer Contributors
 * Copyright (C) 2026 Floodilka Contributors
 * Modified by Floodilka Contributors starting March 2026. See LICENSE and NOTICE.
 */

import type {UserID} from '~/BrandedTypes';
import {BatchBuilder, Db, executeConditional, fetchMany, fetchOne, upsertOne} from '~/database/Cassandra';
import type {GiftCodeRow} from '~/database/CassandraTypes';
import {GiftCode} from '~/Models';
import {GiftCodes, GiftCodesByCreator, GiftCodesByTransaction, GiftCodesByRedeemer} from '~/Tables';

const FETCH_GIFT_CODES_BY_CREATOR_QUERY = GiftCodesByCreator.selectCql({
	columns: ['code'],
	where: GiftCodesByCreator.where.eq('created_by_user_id'),
});

const FETCH_GIFT_CODE_BY_TRANSACTION_QUERY = GiftCodesByTransaction.selectCql({
	columns: ['code'],
	where: GiftCodesByTransaction.where.eq('cloudpayments_transaction_id'),
	limit: 1,
});

const FETCH_GIFT_CODE_QUERY = GiftCodes.selectCql({
	where: GiftCodes.where.eq('code'),
	limit: 1,
});

export class GiftCodeRepository {
	async createGiftCode(data: GiftCodeRow): Promise<void> {
		const batch = new BatchBuilder();
		batch.addPrepared(GiftCodes.upsertAll(data));
		batch.addPrepared(
			GiftCodesByCreator.upsertAll({
				created_by_user_id: data.created_by_user_id,
				code: data.code,
			}),
		);

		if (data.cloudpayments_transaction_id) {
			batch.addPrepared(
				GiftCodesByTransaction.upsertAll({
					cloudpayments_transaction_id: data.cloudpayments_transaction_id,
					code: data.code,
				}),
			);
		}

		await batch.execute();
	}

	async findGiftCode(code: string): Promise<GiftCode | null> {
		const row = await fetchOne<GiftCodeRow>(FETCH_GIFT_CODE_QUERY, {code});

		if (!row) {
			return null;
		}

		return new GiftCode(row);
	}

	async findGiftCodeByTransactionId(transactionId: number | bigint): Promise<GiftCode | null> {
		const row = await fetchOne<{code: string}>(FETCH_GIFT_CODE_BY_TRANSACTION_QUERY, {
			cloudpayments_transaction_id: transactionId,
		});

		if (!row) {
			return null;
		}

		return this.findGiftCode(row.code);
	}

	async findGiftCodesByCreator(userId: UserID): Promise<Array<GiftCode>> {
		const rows = await fetchMany<{code: string}>(FETCH_GIFT_CODES_BY_CREATOR_QUERY, {
			created_by_user_id: userId,
		});

		const giftCodes = await Promise.all(rows.map((row) => this.findGiftCode(row.code)));

		return giftCodes.filter((gc) => gc !== null) as Array<GiftCode>;
	}

	async redeemGiftCode(code: string, userId: UserID): Promise<{applied: boolean}> {
		const redeemedAt = new Date();

		const q = GiftCodes.patchByPkIf(
			{code},
			{
				redeemed_by_user_id: Db.set(userId),
				redeemed_at: Db.set(redeemedAt),
			},
			{col: 'redeemed_by_user_id', expectedParam: 'expected_redeemer', expectedValue: null},
		);

		const result = await executeConditional(q);

		if (result.applied) {
			await upsertOne(
				GiftCodesByRedeemer.upsertAll({
					redeemed_by_user_id: userId,
					code,
				}),
			);
		}

		return result;
	}

	async updateGiftCode(code: string, data: Partial<GiftCodeRow>): Promise<void> {
		const batch = new BatchBuilder();

		const patch: Record<string, ReturnType<typeof Db.set>> = {};
		if (data.redeemed_at !== undefined) {
			patch.redeemed_at = Db.set(data.redeemed_at);
		}
		if (data.redeemed_by_user_id !== undefined) {
			patch.redeemed_by_user_id = Db.set(data.redeemed_by_user_id);
		}

		if (Object.keys(patch).length > 0) {
			batch.addPrepared(GiftCodes.patchByPk({code}, patch));
		}

		if (data.redeemed_by_user_id) {
			batch.addPrepared(
				GiftCodesByRedeemer.upsertAll({
					redeemed_by_user_id: data.redeemed_by_user_id,
					code,
				}),
			);
		}

		await batch.execute();
	}

}
