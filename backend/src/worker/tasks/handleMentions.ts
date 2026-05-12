/*
 * SPDX-License-Identifier: AGPL-3.0-or-later
 * Copyright (C) 2020-2026 Fluxer Contributors
 * Copyright (C) 2026 Floodilka Contributors
 * Modified by Floodilka Contributors starting March 2026. See LICENSE and NOTICE.
 */

import type {Task} from '~/worker/TaskTypes';
import {createChannelID, createGuildID, createMessageID, createUserID, type UserID} from '~/BrandedTypes';
import {Logger} from '~/Logger';
import {CommonFields, validatePayload} from '../utils/TaskPayloadValidator';
import {getWorkerDependencies} from '../WorkerContext';

interface HandleMentionsPayload {
	guildId?: string;
	channelId: string;
	messageId: string;
	authorId: string;
	mentionHere?: boolean;
}

const payloadSchema = {
	channelId: CommonFields.channelId(),
	messageId: CommonFields.messageId(),
	authorId: CommonFields.userId(),
	guildId: CommonFields.guildId('optional'),
	mentionHere: CommonFields.boolean('optional'),
};

const handleMentions: Task = async (payload, helpers) => {
	const validated = validatePayload<HandleMentionsPayload>(payload, payloadSchema);
	helpers.logger.debug('Processing handleMentions task', {payload: validated});

	const {userRepository, channelRepository, readStateService, gatewayService} = getWorkerDependencies();

	const authorId = createUserID(BigInt(validated.authorId));
	const channelId = createChannelID(BigInt(validated.channelId));
	const messageId = createMessageID(BigInt(validated.messageId));
	const guildId = validated.guildId ? createGuildID(BigInt(validated.guildId)) : null;
	const mentionHere = validated.mentionHere ?? false;

	const message = await channelRepository.getMessage(channelId, messageId);
	if (!message) {
		Logger.debug({messageId}, 'handleMentions: Message not found, skipping');
		return;
	}

	const channel = await channelRepository.findUnique(channelId);
	if (!channel) {
		Logger.debug({channelId}, 'handleMentions: Channel not found, skipping');
		return;
	}

	let mentionedUserIds: Array<UserID>;

	if (channel.guildId) {
		const isEveryoneMention = message.mentionEveryone && !mentionHere;
		mentionedUserIds = await gatewayService.resolveAllMentions({
			guildId: channel.guildId,
			channelId,
			authorId,
			mentionEveryone: isEveryoneMention,
			mentionHere,
			roleIds: Array.from(message.mentionedRoleIds),
			userIds: Array.from(message.mentionedUserIds),
		});
		Logger.debug(
			{
				channelId,
				guildId: channel.guildId,
				mentionedCount: mentionedUserIds.length,
				everyoneMention: isEveryoneMention,
				hereMention: mentionHere,
				roleCount: message.mentionedRoleIds.size,
				userCount: message.mentionedUserIds.size,
			},
			'Resolved all mentions via combined RPC',
		);
	} else {
		mentionedUserIds = Array.from(message.mentionedUserIds).filter((userId) => userId !== authorId);
		Logger.debug({channelId, userMentionCount: mentionedUserIds.length}, 'Handled DM user mentions');
	}

	if (mentionedUserIds.length === 0) {
		Logger.debug({channelId, guildId}, 'No users to mention, skipping read state updates');
		return;
	}

	await readStateService.bulkIncrementMentionCounts(mentionedUserIds.map((userId) => ({userId, channelId})));
	const uniqueUserIds = Array.from(new Set(mentionedUserIds));
	await Promise.all(uniqueUserIds.map((userId) => gatewayService.invalidatePushBadgeCount({userId})));

	if (guildId != null) {
		await userRepository.createRecentMentions(
			mentionedUserIds.map((userId) => ({
				user_id: userId,
				channel_id: channelId,
				message_id: messageId,
				guild_id: guildId,
				is_everyone: message.mentionEveryone,
				is_role: message.mentionedRoleIds.size > 0,
			})),
		);
	}

	Logger.debug(
		{
			channelId,
			guildId,
			totalMentioned: mentionedUserIds.length,
			everyoneMentions: message.mentionEveryone ? 1 : 0,
			roleMentions: message.mentionedRoleIds.size,
			userMentions: message.mentionedUserIds.size,
		},
		'Handled all mentions',
	);
};

export default handleMentions;
