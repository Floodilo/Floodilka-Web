/*
 * SPDX-License-Identifier: AGPL-3.0-or-later
 * Copyright (C) 2020-2026 Fluxer Contributors
 * Copyright (C) 2026 Floodilka Contributors
 * Modified by Floodilka Contributors starting March 2026. See LICENSE and NOTICE.
 */

import type {UserID} from '~/BrandedTypes';
import {BatchBuilder} from '~/database/Cassandra';
import type {UserRow} from '~/database/CassandraTypes';
import {UserByCloudpaymentsSubscriptionId, UserByEmail, UserByPhone, UserByUsername} from '~/Tables';

export class UserIndexRepository {
	async syncIndices(data: UserRow, oldData?: UserRow | null): Promise<void> {
		const batch = new BatchBuilder();

		if (!!data.username) {
			batch.addPrepared(
				UserByUsername.upsertAll({
					username: data.username.toLowerCase(),
					user_id: data.user_id,
				}),
			);
		}
		if (oldData?.username) {
			if (oldData.username.toLowerCase() !== data.username?.toLowerCase()) {
				batch.addPrepared(
					UserByUsername.deleteByPk({
						username: oldData.username.toLowerCase(),
						user_id: oldData.user_id,
					}),
				);
			}
		}

		if (data.email) {
			batch.addPrepared(
				UserByEmail.upsertAll({
					email_lower: data.email.toLowerCase(),
					user_id: data.user_id,
				}),
			);
		}
		if (oldData?.email && oldData.email.toLowerCase() !== data.email?.toLowerCase()) {
			batch.addPrepared(
				UserByEmail.deleteByPk({
					email_lower: oldData.email.toLowerCase(),
					user_id: oldData.user_id,
				}),
			);
		}

		if (data.phone) {
			batch.addPrepared(
				UserByPhone.upsertAll({
					phone: data.phone,
					user_id: data.user_id,
				}),
			);
		}
		if (oldData?.phone && oldData.phone !== data.phone) {
			batch.addPrepared(
				UserByPhone.deleteByPk({
					phone: oldData.phone,
					user_id: oldData.user_id,
				}),
			);
		}

		if (data.cloudpayments_subscription_id) {
			batch.addPrepared(
				UserByCloudpaymentsSubscriptionId.upsertAll({
					cloudpayments_subscription_id: data.cloudpayments_subscription_id,
					user_id: data.user_id,
				}),
			);
		}
		if (oldData?.cloudpayments_subscription_id && oldData.cloudpayments_subscription_id !== data.cloudpayments_subscription_id) {
			batch.addPrepared(
				UserByCloudpaymentsSubscriptionId.deleteByPk({
					cloudpayments_subscription_id: oldData.cloudpayments_subscription_id,
					user_id: oldData.user_id,
				}),
			);
		}

		await batch.execute();
	}

	async deleteIndices(
		userId: UserID,
		username: string,
		email?: string | null,
		phone?: string | null,
		cloudpaymentsSubscriptionId?: string | null,
	): Promise<void> {
		const batch = new BatchBuilder();

		batch.addPrepared(
			UserByUsername.deleteByPk({
				username: username.toLowerCase(),
				user_id: userId,
			}),
		);

		if (email) {
			batch.addPrepared(
				UserByEmail.deleteByPk({
					email_lower: email.toLowerCase(),
					user_id: userId,
				}),
			);
		}

		if (phone) {
			batch.addPrepared(
				UserByPhone.deleteByPk({
					phone: phone,
					user_id: userId,
				}),
			);
		}

		if (cloudpaymentsSubscriptionId) {
			batch.addPrepared(
				UserByCloudpaymentsSubscriptionId.deleteByPk({
					cloudpayments_subscription_id: cloudpaymentsSubscriptionId,
					user_id: userId,
				}),
			);
		}

		await batch.execute();
	}
}
