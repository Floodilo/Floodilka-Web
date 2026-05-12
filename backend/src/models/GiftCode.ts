/*
 * SPDX-License-Identifier: AGPL-3.0-or-later
 * Copyright (C) 2020-2026 Fluxer Contributors
 * Copyright (C) 2026 Floodilka Contributors
 * Modified by Floodilka Contributors starting March 2026. See LICENSE and NOTICE.
 */

import type {GiftCodeRow} from '~/database/CassandraTypes';
import type {UserID} from '../BrandedTypes';

export class GiftCode {
	readonly code: string;
	readonly durationMonths: number;
	readonly createdAt: Date;
	readonly createdByUserId: UserID;
	readonly redeemedAt: Date | null;
	readonly redeemedByUserId: UserID | null;
	readonly cloudpaymentsTransactionId: number | null;
	readonly paymentId: string | null;
	readonly version: number;

	constructor(row: GiftCodeRow) {
		this.code = row.code;
		this.durationMonths = row.duration_months;
		this.createdAt = row.created_at;
		this.createdByUserId = row.created_by_user_id as UserID;
		this.redeemedAt = row.redeemed_at ?? null;
		this.redeemedByUserId = row.redeemed_by_user_id ? (row.redeemed_by_user_id as UserID) : null;
		this.cloudpaymentsTransactionId = row.cloudpayments_transaction_id ?? null;
		this.paymentId = row.payment_id ?? null;
		this.version = row.version;
	}

	toRow(): GiftCodeRow {
		return {
			code: this.code,
			duration_months: this.durationMonths,
			created_at: this.createdAt,
			created_by_user_id: this.createdByUserId,
			redeemed_at: this.redeemedAt,
			redeemed_by_user_id: this.redeemedByUserId,
			cloudpayments_transaction_id: this.cloudpaymentsTransactionId,
			payment_id: this.paymentId,
			version: this.version,
		};
	}
}
