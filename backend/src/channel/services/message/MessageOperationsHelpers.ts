/*
 * SPDX-License-Identifier: AGPL-3.0-or-later
 * Copyright (C) 2020-2026 Fluxer Contributors
 * Copyright (C) 2026 Floodilka Contributors
 * Modified by Floodilka Contributors starting March 2026. See LICENSE and NOTICE.
 */

import {
	type ChannelID,
	createAttachmentID,
	createChannelID,
	createMemeID,
	createMessageID,
	type UserID,
} from '~/BrandedTypes';
import {Config} from '~/Config';
import type {MessageAttachment} from '~/database/CassandraTypes';
import {InputValidationError, UnknownMessageError} from '~/Errors';
import type {IFavoriteMemeRepository} from '~/favorite_meme/IFavoriteMemeRepository';
import type {ICacheService} from '~/infrastructure/ICacheService';
import type {IStorageService} from '~/infrastructure/IStorageService';
import type {SnowflakeService} from '~/infrastructure/SnowflakeService';
import type {Message, User} from '~/Models';
import type {IChannelRepositoryAggregate} from '../../repositories/IChannelRepositoryAggregate';
import {makeAttachmentCdnKey} from './MessageHelpers';

interface MessageOperationsHelpersDeps {
	channelRepository: IChannelRepositoryAggregate;
	cacheService: ICacheService;
	storageService: IStorageService;
	snowflakeService: SnowflakeService;
	favoriteMemeRepository: IFavoriteMemeRepository;
}

export class MessageOperationsHelpers {
	constructor(private readonly deps: MessageOperationsHelpersDeps) {}

	async findExistingMessage({
		userId,
		nonce,
		expectedChannelId,
	}: {
		userId: UserID;
		nonce?: string;
		expectedChannelId: ChannelID;
	}): Promise<Message | null> {
		if (!nonce) return null;

		const existingNonce = await this.deps.cacheService.get<{channel_id: string; message_id: string}>(
			`message-nonce:${userId}:${nonce}`,
		);

		if (!existingNonce) return null;

		const cachedChannelId = createChannelID(BigInt(existingNonce.channel_id));
		if (cachedChannelId !== expectedChannelId) {
			throw new UnknownMessageError();
		}

		return this.deps.channelRepository.messages.getMessage(
			cachedChannelId,
			createMessageID(BigInt(existingNonce.message_id)),
		);
	}

	async processFavoriteMeme({
		user,
		channelId,
		favoriteMemeId,
	}: {
		user: User;
		channelId: ChannelID;
		favoriteMemeId: bigint;
	}): Promise<MessageAttachment> {
		const memeId = createMemeID(favoriteMemeId);
		const favoriteMeme = await this.deps.favoriteMemeRepository.findById(user.id, memeId);

		if (!favoriteMeme) {
			throw InputValidationError.create('favorite_meme_id', 'Избранный мем не найден');
		}

		const memeAttachmentId = createAttachmentID(this.deps.snowflakeService.generate());

		const sourceKey = favoriteMeme.storageKey;
		const destKey = makeAttachmentCdnKey(channelId, memeAttachmentId, favoriteMeme.filename);

		await this.deps.storageService.copyObject({
			sourceBucket: Config.s3.buckets.cdn,
			sourceKey,
			destinationBucket: Config.s3.buckets.cdn,
			destinationKey: destKey,
			newContentType: favoriteMeme.contentType,
		});

		let flags = 0;
		if (favoriteMeme.isGifv || (favoriteMeme.duration != null && favoriteMeme.duration > 0)) {
			flags |= 1;
		}

		return {
			attachment_id: memeAttachmentId,
			filename: favoriteMeme.filename,
			size: favoriteMeme.size,
			title: null,
			description: favoriteMeme.altText,
			width: favoriteMeme.width,
			height: favoriteMeme.height,
			content_type: favoriteMeme.contentType,
			content_hash: favoriteMeme.contentHash,
			placeholder: null,
			flags,
			duration: favoriteMeme.duration,
			nsfw: null,
		};
	}
}
