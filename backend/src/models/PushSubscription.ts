/*
 * SPDX-License-Identifier: AGPL-3.0-or-later
 * Copyright (C) 2020-2026 Fluxer Contributors
 * Copyright (C) 2026 Floodilka Contributors
 * Modified by Floodilka Contributors starting March 2026. See LICENSE and NOTICE.
 */

import type {PushSubscriptionRow} from '~/database/CassandraTypes';
import type {UserID} from '../BrandedTypes';

export class PushSubscription {
	readonly userId: UserID;
	readonly subscriptionId: string;
	readonly endpoint: string;
	readonly p256dhKey: string;
	readonly authKey: string;
	readonly userAgent: string | null;

	constructor(row: PushSubscriptionRow) {
		this.userId = row.user_id;
		this.subscriptionId = row.subscription_id;
		this.endpoint = row.endpoint;
		this.p256dhKey = row.p256dh_key;
		this.authKey = row.auth_key;
		this.userAgent = row.user_agent ?? null;
	}

	toRow(): PushSubscriptionRow {
		return {
			user_id: this.userId,
			subscription_id: this.subscriptionId,
			endpoint: this.endpoint,
			p256dh_key: this.p256dhKey,
			auth_key: this.authKey,
			user_agent: this.userAgent,
		};
	}
}
