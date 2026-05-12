/*
 * SPDX-License-Identifier: AGPL-3.0-or-later
 * Copyright (C) 2020-2026 Fluxer Contributors
 * Copyright (C) 2026 Floodilka Contributors
 * Modified by Floodilka Contributors starting March 2026. See LICENSE and NOTICE.
 */

import type {UserID} from '~/BrandedTypes';
import {fetchOne} from '~/database/Cassandra';
import type {
	UserByEmailRow,
	UserByPhoneRow,
	UserByCloudpaymentsSubscriptionIdRow,
	UserByUsernameRow,
} from '~/database/CassandraTypes';
import type {User} from '~/Models';
import {UserByEmail, UserByPhone, UserByCloudpaymentsSubscriptionId, UserByUsername} from '~/Tables';

const FETCH_USER_ID_BY_EMAIL_QUERY = UserByEmail.select({
	columns: ['user_id'],
	where: UserByEmail.where.eq('email_lower'),
	limit: 1,
});

const FETCH_USER_ID_BY_PHONE_QUERY = UserByPhone.select({
	columns: ['user_id'],
	where: UserByPhone.where.eq('phone'),
	limit: 1,
});

const FETCH_USER_ID_BY_CLOUDPAYMENTS_SUBSCRIPTION_ID_QUERY = UserByCloudpaymentsSubscriptionId.select({
	columns: ['user_id'],
	where: UserByCloudpaymentsSubscriptionId.where.eq('cloudpayments_subscription_id'),
	limit: 1,
});

const FETCH_USER_ID_BY_USERNAME_QUERY = UserByUsername.select({
	columns: ['user_id'],
	where: UserByUsername.where.eq('username'),
	limit: 1,
});

export class UserLookupRepository {
	constructor(private findUniqueUser: (userId: UserID) => Promise<User | null>) {}

	async findByEmail(email: string): Promise<User | null> {
		const emailLower = email.toLowerCase();
		const result = await fetchOne<Pick<UserByEmailRow, 'user_id'>>(
			FETCH_USER_ID_BY_EMAIL_QUERY.bind({email_lower: emailLower}),
		);
		if (!result) return null;
		return await this.findUniqueUser(result.user_id);
	}

	async findByPhone(phone: string): Promise<User | null> {
		const result = await fetchOne<Pick<UserByPhoneRow, 'user_id'>>(FETCH_USER_ID_BY_PHONE_QUERY.bind({phone}));
		if (!result) return null;
		return await this.findUniqueUser(result.user_id);
	}

	async findByCloudpaymentsSubscriptionId(cloudpaymentsSubscriptionId: string): Promise<User | null> {
		const result = await fetchOne<Pick<UserByCloudpaymentsSubscriptionIdRow, 'user_id'>>(
			FETCH_USER_ID_BY_CLOUDPAYMENTS_SUBSCRIPTION_ID_QUERY.bind({cloudpayments_subscription_id: cloudpaymentsSubscriptionId}),
		);
		if (!result) return null;
		return await this.findUniqueUser(result.user_id);
	}

	async findByUsername(username: string): Promise<User | null> {
		const usernameLower = username.toLowerCase();
		const result = await fetchOne<Pick<UserByUsernameRow, 'user_id'>>(
			FETCH_USER_ID_BY_USERNAME_QUERY.bind({username: usernameLower}),
		);
		if (!result) return null;
		return await this.findUniqueUser(result.user_id);
	}
}
