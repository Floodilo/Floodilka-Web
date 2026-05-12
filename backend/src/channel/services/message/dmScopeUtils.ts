/*
 * SPDX-License-Identifier: AGPL-3.0-or-later
 * Copyright (C) 2020-2026 Fluxer Contributors
 * Copyright (C) 2026 Floodilka Contributors
 * Modified by Floodilka Contributors starting March 2026. See LICENSE and NOTICE.
 */

import type {ChannelID, UserID} from '~/BrandedTypes';
import {ChannelTypes} from '~/Constants';
import type {IUserRepository} from '~/user/IUserRepository';

export type DmSearchScope = 'all_dms' | 'open_dms';

export interface DmScopeOptions {
	scope: DmSearchScope;
	userId: UserID;
	userRepository: IUserRepository;
	includeChannelId?: ChannelID | null;
}

export const getDmChannelIdsForScope = async ({
	scope,
	userId,
	userRepository,
	includeChannelId,
}: DmScopeOptions): Promise<Array<string>> => {
	const summaryResults = await userRepository.listPrivateChannelSummaries(userId);
	const channelIdStrings = new Set<string>();

	for (const summary of summaryResults) {
		const isDm =
			summary.channelType === ChannelTypes.DM || summary.channelType === ChannelTypes.GROUP_DM || summary.isGroupDm;

		if (!isDm) {
			continue;
		}

		if (scope === 'open_dms' && !summary.open) {
			continue;
		}

		channelIdStrings.add(summary.channelId.toString());
	}

	if (scope === 'all_dms') {
		const historicalIds = await userRepository.listHistoricalDmChannelIds(userId);
		for (const channelId of historicalIds) {
			channelIdStrings.add(channelId.toString());
		}
	}

	if (includeChannelId) {
		channelIdStrings.add(includeChannelId.toString());
	}

	return Array.from(channelIdStrings);
};
