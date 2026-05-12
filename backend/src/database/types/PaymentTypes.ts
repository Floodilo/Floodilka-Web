/*
 * SPDX-License-Identifier: AGPL-3.0-or-later
 * Copyright (C) 2020-2026 Fluxer Contributors
 * Copyright (C) 2026 Floodilka Contributors
 * Modified by Floodilka Contributors starting March 2026. See LICENSE and NOTICE.
 */

import type {UserID} from '~/BrandedTypes';

type Nullish<T> = T | null;

export interface GiftCodeRow {
	code: string;
	duration_months: number;
	created_at: Date;
	created_by_user_id: UserID;
	redeemed_at: Nullish<Date>;
	redeemed_by_user_id: Nullish<UserID>;
	cloudpayments_transaction_id: Nullish<number | bigint>;
	payment_id: Nullish<string>;
	version: number;
}

export interface PaymentRow {
	payment_id: string;
	user_id: UserID;
	cloudpayments_transaction_id: Nullish<number | bigint>;
	cloudpayments_subscription_id: Nullish<string>;
	product_type: Nullish<string>;
	amount_cents: number;
	currency: string;
	status: string;
	is_gift: boolean;
	gift_code: Nullish<string>;
	created_at: Date;
	completed_at: Nullish<Date>;
	version: number;
}

export const PAYMENT_COLUMNS = [
	'payment_id',
	'user_id',
	'cloudpayments_transaction_id',
	'cloudpayments_subscription_id',
	'product_type',
	'amount_cents',
	'currency',
	'status',
	'is_gift',
	'gift_code',
	'created_at',
	'completed_at',
	'version',
] as const;

export const PAYMENT_BY_TRANSACTION_COLUMNS = ['cloudpayments_transaction_id', 'payment_id'] as const;

export const PAYMENT_BY_USER_COLUMNS = ['user_id', 'created_at', 'payment_id'] as const;

export const GIFT_CODE_COLUMNS = [
	'code',
	'duration_months',
	'created_at',
	'created_by_user_id',
	'redeemed_at',
	'redeemed_by_user_id',
	'cloudpayments_transaction_id',
	'payment_id',
	'version',
] as const;

export const GIFT_CODE_BY_CREATOR_COLUMNS = ['created_by_user_id', 'code'] as const;

export const GIFT_CODE_BY_TRANSACTION_COLUMNS = ['cloudpayments_transaction_id', 'code'] as const;

export const GIFT_CODE_BY_REDEEMER_COLUMNS = ['redeemed_by_user_id', 'code'] as const;

export interface PaymentByTransactionRow {
	cloudpayments_transaction_id: number | bigint;
	payment_id: string;
}

export interface PaymentByUserRow {
	user_id: UserID;
	created_at: Date;
	payment_id: string;
}

export interface GiftCodeByCreatorRow {
	created_by_user_id: UserID;
	code: string;
}

export interface GiftCodeByTransactionRow {
	cloudpayments_transaction_id: number | bigint;
	code: string;
}

export interface GiftCodeByRedeemerRow {
	redeemed_by_user_id: UserID;
	code: string;
}
