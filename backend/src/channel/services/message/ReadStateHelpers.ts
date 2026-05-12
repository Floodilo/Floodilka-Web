/*
 * SPDX-License-Identifier: AGPL-3.0-or-later
 * Copyright (C) 2020-2026 Fluxer Contributors
 * Copyright (C) 2026 Floodilka Contributors
 * Modified by Floodilka Contributors starting March 2026. See LICENSE and NOTICE.
 */

import type {ChannelID} from '~/BrandedTypes';
import type {User} from '~/Models';
import type {ReadStateService} from '~/read_state/ReadStateService';

interface IncrementDmMentionCountsParams {
	readStateService: ReadStateService;
	user: User | null;
	recipients: Array<User>;
	channelId: ChannelID;
}

export async function incrementDmMentionCounts(params: IncrementDmMentionCountsParams): Promise<void> {
	const {readStateService, user, recipients, channelId} = params;

	if (!user || user.isBot) return;

	const validRecipients = recipients.filter((recipient) => recipient.id !== user.id && !recipient.isBot);

	if (validRecipients.length === 0) return;

	await readStateService.bulkIncrementMentionCounts(
		validRecipients.map((recipient) => ({
			userId: recipient.id,
			channelId,
		})),
	);
}
