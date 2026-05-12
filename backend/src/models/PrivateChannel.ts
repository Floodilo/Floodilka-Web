/*
 * SPDX-License-Identifier: AGPL-3.0-or-later
 * Copyright (C) 2020-2026 Fluxer Contributors
 * Copyright (C) 2026 Floodilka Contributors
 * Modified by Floodilka Contributors starting March 2026. See LICENSE and NOTICE.
 */

import type {PrivateChannelRow} from '~/database/CassandraTypes';
import type {ChannelID, UserID} from '../BrandedTypes';

export class PrivateChannel {
	readonly userId: UserID;
	readonly channelId: ChannelID;
	readonly isGroupDM: boolean;

	constructor(row: PrivateChannelRow) {
		this.userId = row.user_id;
		this.channelId = row.channel_id;
		this.isGroupDM = row.is_gdm ?? false;
	}

	toRow(): PrivateChannelRow {
		return {
			user_id: this.userId,
			channel_id: this.channelId,
			is_gdm: this.isGroupDM,
		};
	}
}
