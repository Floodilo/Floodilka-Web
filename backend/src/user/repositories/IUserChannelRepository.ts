/*
 * SPDX-License-Identifier: AGPL-3.0-or-later
 * Copyright (C) 2020-2026 Fluxer Contributors
 * Copyright (C) 2026 Floodilka Contributors
 * Modified by Floodilka Contributors starting March 2026. See LICENSE and NOTICE.
 */

import type {ChannelID, MessageID, UserID} from '~/BrandedTypes';
import type {Channel} from '~/Models';

export interface PrivateChannelSummary {
	channelId: ChannelID;
	isGroupDm: boolean;
	channelType: number | null;
	lastMessageId: MessageID | null;
	open: boolean;
}

export interface IUserChannelRepository {
	listPrivateChannels(userId: UserID): Promise<Array<Channel>>;
	deleteAllPrivateChannels(userId: UserID): Promise<void>;
	listPrivateChannelSummaries(userId: UserID): Promise<Array<PrivateChannelSummary>>;
	listHistoricalDmChannelIds(userId: UserID): Promise<Array<ChannelID>>;
	recordHistoricalDmChannel(userId: UserID, channelId: ChannelID, isGroupDm: boolean): Promise<void>;

	findExistingDmState(user1Id: UserID, user2Id: UserID): Promise<Channel | null>;
	createDmChannelAndState(user1Id: UserID, user2Id: UserID, channelId: ChannelID): Promise<Channel>;
	isDmChannelOpen(userId: UserID, channelId: ChannelID): Promise<boolean>;
	openDmForUser(userId: UserID, channelId: ChannelID, isGroupDm?: boolean): Promise<void>;
	closeDmForUser(userId: UserID, channelId: ChannelID): Promise<void>;

	getPinnedDms(userId: UserID): Promise<Array<ChannelID>>;
	getPinnedDmsWithDetails(userId: UserID): Promise<Array<{channel_id: ChannelID; sort_order: number}>>;
	addPinnedDm(userId: UserID, channelId: ChannelID): Promise<Array<ChannelID>>;
	removePinnedDm(userId: UserID, channelId: ChannelID): Promise<Array<ChannelID>>;
	deletePinnedDmsByUserId(userId: UserID): Promise<void>;

	deleteAllReadStates(userId: UserID): Promise<void>;
}
