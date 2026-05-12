/*
 * SPDX-License-Identifier: AGPL-3.0-or-later
 * Copyright (C) 2020-2026 Fluxer Contributors
 * Copyright (C) 2026 Floodilka Contributors
 * Modified by Floodilka Contributors starting March 2026. See LICENSE and NOTICE.
 */

import {ChannelTypes, RelationshipTypes} from '~/Constants';
import type {ChannelRecord} from '~/records/ChannelRecord';
import RelationshipStore from '~/stores/RelationshipStore';
import UserPinnedDMStore from '~/stores/UserPinnedDMStore';
import SnowflakeUtil from '~/utils/SnowflakeUtil';

const getChannelSortSnowflake = (channel: ChannelRecord): string => {
	const baseSnowflake = channel.lastMessageId ?? channel.id;

	if (channel.type !== ChannelTypes.DM) {
		return baseSnowflake;
	}

	const recipientId = channel.recipientIds[0];
	if (!recipientId) {
		return baseSnowflake;
	}

	const relationship = RelationshipStore.getRelationship(recipientId);
	if (!relationship || relationship.type !== RelationshipTypes.FRIEND) {
		return baseSnowflake;
	}

	const sinceTimestamp = relationship.since.getTime();
	if (!Number.isFinite(sinceTimestamp)) {
		return baseSnowflake;
	}

	const friendshipSnowflake = SnowflakeUtil.fromTimestamp(sinceTimestamp);
	return SnowflakeUtil.compare(friendshipSnowflake, baseSnowflake) > 0 ? friendshipSnowflake : baseSnowflake;
};

export const getSortedDmChannels = (
	dmChannels: ReadonlyArray<ChannelRecord>,
	currentUserId?: string | null,
): Array<ChannelRecord> => {
	const pinnedOrder = new Map(UserPinnedDMStore.pinnedDMs.map((id, index) => [id, index]));

	const compareChannelIds = (a: ChannelRecord, b: ChannelRecord): number => (a.id < b.id ? -1 : a.id > b.id ? 1 : 0);

	return dmChannels
		.filter((channel) => !(channel.type === ChannelTypes.DM_PERSONAL_NOTES || channel.id === currentUserId))
		.sort((a, b) => {
			const aIndex = pinnedOrder.get(a.id);
			const bIndex = pinnedOrder.get(b.id);
			const aIsPinned = aIndex !== undefined;
			const bIsPinned = bIndex !== undefined;

			if (aIsPinned && bIsPinned) {
				const diff = aIndex - bIndex;
				if (diff !== 0) {
					return diff;
				}
				return compareChannelIds(a, b);
			}
			if (aIsPinned !== bIsPinned) {
				return aIsPinned ? -1 : 1;
			}

			const aSortSnowflake = getChannelSortSnowflake(a);
			const bSortSnowflake = getChannelSortSnowflake(b);
			const sortDiff = SnowflakeUtil.compare(bSortSnowflake, aSortSnowflake);
			if (sortDiff !== 0) {
				return sortDiff;
			}
			return compareChannelIds(a, b);
		});
};
