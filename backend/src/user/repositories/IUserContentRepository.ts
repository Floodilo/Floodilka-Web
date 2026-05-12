/*
 * SPDX-License-Identifier: AGPL-3.0-or-later
 * Copyright (C) 2020-2026 Fluxer Contributors
 * Copyright (C) 2026 Floodilka Contributors
 * Modified by Floodilka Contributors starting March 2026. See LICENSE and NOTICE.
 */

import type {ChannelID, MessageID, UserID} from '~/BrandedTypes';
import type {
	GiftCodeRow,
	PaymentRow,
	PushSubscriptionRow,
	RecentMentionRow,
} from '~/database/CassandraTypes';
import type {GiftCode, MobilePushToken, Payment, PushSubscription, RecentMention, SavedMessage} from '~/Models';

export interface IUserContentRepository {
	getRecentMention(userId: UserID, messageId: MessageID): Promise<RecentMention | null>;
	listRecentMentions(
		userId: UserID,
		includeEveryone: boolean,
		includeRole: boolean,
		includeGuilds: boolean,
		limit: number,
		before?: MessageID,
	): Promise<Array<RecentMention>>;
	createRecentMention(mention: RecentMentionRow): Promise<RecentMention>;
	createRecentMentions(mentions: Array<RecentMentionRow>): Promise<void>;
	deleteRecentMention(mention: RecentMention): Promise<void>;
	deleteAllRecentMentions(userId: UserID): Promise<void>;

	listSavedMessages(userId: UserID, limit?: number, before?: MessageID): Promise<Array<SavedMessage>>;
	createSavedMessage(userId: UserID, channelId: ChannelID, messageId: MessageID): Promise<SavedMessage>;
	deleteSavedMessage(userId: UserID, messageId: MessageID): Promise<void>;
	deleteAllSavedMessages(userId: UserID): Promise<void>;

	createGiftCode(data: GiftCodeRow): Promise<void>;
	findGiftCode(code: string): Promise<GiftCode | null>;
	findGiftCodeByTransactionId(transactionId: number): Promise<GiftCode | null>;
	findGiftCodesByCreator(userId: UserID): Promise<Array<GiftCode>>;
	redeemGiftCode(code: string, userId: UserID): Promise<{applied: boolean}>;
	updateGiftCode(code: string, data: Partial<GiftCodeRow>): Promise<void>;

	listPushSubscriptions(userId: UserID): Promise<Array<PushSubscription>>;
	createPushSubscription(data: PushSubscriptionRow): Promise<PushSubscription>;
	deletePushSubscription(userId: UserID, subscriptionId: string): Promise<void>;
	getBulkPushSubscriptions(userIds: Array<UserID>): Promise<Map<UserID, Array<PushSubscription>>>;
	deleteAllPushSubscriptions(userId: UserID): Promise<void>;

	upsertMobilePushToken(userId: UserID, token: string, platform: string): Promise<MobilePushToken>;
	deleteMobilePushTokenByValue(userId: UserID, token: string): Promise<void>;
	deleteMobilePushToken(userId: UserID, tokenId: string): Promise<void>;
	getBulkMobilePushTokens(userIds: Array<UserID>): Promise<Map<UserID, Array<MobilePushToken>>>;
	deleteAllMobilePushTokens(userId: UserID): Promise<void>;

	createPayment(data: {
		payment_id: string;
		user_id: UserID;
		product_type: string;
		amount_cents: number;
		currency: string;
		status: string;
		is_gift: boolean;
		created_at: Date;
		cloudpayments_transaction_id?: number | null;
		cloudpayments_subscription_id?: string | null;
		gift_code?: string | null;
		completed_at?: Date | null;
	}): Promise<void>;
	updatePayment(data: Partial<PaymentRow> & {payment_id: string}): Promise<{applied: boolean}>;
	getPaymentById(paymentId: string): Promise<Payment | null>;
	getPaymentByTransactionId(transactionId: number): Promise<Payment | null>;
}
