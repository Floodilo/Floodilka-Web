/*
 * SPDX-License-Identifier: AGPL-3.0-or-later
 * Copyright (C) 2020-2026 Fluxer Contributors
 * Copyright (C) 2026 Floodilka Contributors
 * Modified by Floodilka Contributors starting March 2026. See LICENSE and NOTICE.
 */

import {ChannelTypes} from '~/Constants';
import type {ChannelRecord} from '~/records/ChannelRecord';
import ChannelStore from '~/stores/ChannelStore';
import * as SnowflakeUtils from '~/utils/SnowflakeUtils';

export const MAX_GROUP_DM_RECIPIENTS = 10;

const canonicalizeRecipientIds = (recipientIds: ReadonlyArray<string>): string => {
	const sortedRecipients = Array.from(new Set(recipientIds)).sort();
	return JSON.stringify(sortedRecipients);
};

export const getDuplicateGroupDMChannels = (
	recipientIds: ReadonlyArray<string>,
	excludeChannelId?: string,
): Array<ChannelRecord> => {
	const key = canonicalizeRecipientIds(recipientIds);

	return ChannelStore.getPrivateChannels()
		.filter((channel) => channel.type === ChannelTypes.GROUP_DM && channel.recipientIds.length > 0)
		.filter((channel) => !excludeChannelId || channel.id !== excludeChannelId)
		.filter((channel) => canonicalizeRecipientIds(channel.recipientIds) === key)
		.sort((a, b) => {
			const aSnowflake = a.lastMessageId ?? a.id;
			const bSnowflake = b.lastMessageId ?? b.id;
			return SnowflakeUtils.compare(bSnowflake, aSnowflake);
		});
};
