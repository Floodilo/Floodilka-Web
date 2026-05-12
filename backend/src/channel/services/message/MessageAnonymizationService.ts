/*
 * SPDX-License-Identifier: AGPL-3.0-or-later
 * Copyright (C) 2020-2026 Fluxer Contributors
 * Copyright (C) 2026 Floodilka Contributors
 * Modified by Floodilka Contributors starting March 2026. See LICENSE and NOTICE.
 */

import type {ChannelID, MessageID, UserID} from '~/BrandedTypes';
import {Logger} from '~/Logger';
import type {IChannelRepositoryAggregate} from '../../repositories/IChannelRepositoryAggregate';

export class MessageAnonymizationService {
	constructor(private channelRepository: IChannelRepositoryAggregate) {}

	async anonymizeMessagesByAuthor(originalAuthorId: UserID, newAuthorId: UserID): Promise<void> {
		const CHUNK_SIZE = 100;
		let lastChannelId: ChannelID | undefined;
		let lastMessageId: MessageID | undefined;
		let processedCount = 0;

		while (true) {
			const messagesToAnonymize = await this.channelRepository.messages.listMessagesByAuthor(
				originalAuthorId,
				CHUNK_SIZE,
				lastChannelId,
				lastMessageId,
			);

			if (messagesToAnonymize.length === 0) {
				break;
			}

			for (const {channelId, messageId} of messagesToAnonymize) {
				await this.channelRepository.messages.anonymizeMessage(channelId, messageId, newAuthorId);
			}

			processedCount += messagesToAnonymize.length;
			lastChannelId = messagesToAnonymize[messagesToAnonymize.length - 1].channelId;
			lastMessageId = messagesToAnonymize[messagesToAnonymize.length - 1].messageId;

			Logger.debug(
				{originalAuthorId, processedCount, chunkSize: messagesToAnonymize.length},
				'Anonymized message chunk',
			);

			if (messagesToAnonymize.length < CHUNK_SIZE) {
				break;
			}
		}

		Logger.debug({originalAuthorId, newAuthorId, totalProcessed: processedCount}, 'Completed message anonymization');
	}
}
