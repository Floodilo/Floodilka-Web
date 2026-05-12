/*
 * SPDX-License-Identifier: AGPL-3.0-or-later
 * Copyright (C) 2020-2026 Fluxer Contributors
 * Copyright (C) 2026 Floodilka Contributors
 * Modified by Floodilka Contributors starting March 2026. See LICENSE and NOTICE.
 */

import type {Task} from '~/worker/TaskTypes';
import {createGuildID, createUserID} from '~/BrandedTypes';
import {Logger} from '~/Logger';
import {CommonFields, validatePayload} from '../utils/TaskPayloadValidator';
import {getWorkerDependencies} from '../WorkerContext';

interface DeleteUserMessagesInGuildByTimePayload {
	guildId: string;
	userId: string;
	days: number;
}

const payloadSchema = {
	guildId: CommonFields.guildId(),
	userId: CommonFields.userId(),
	days: CommonFields.days(),
};

const deleteUserMessagesInGuildByTime: Task = async (payload, helpers) => {
	const validated = validatePayload<DeleteUserMessagesInGuildByTimePayload>(payload, payloadSchema);
	helpers.logger.debug('Processing deleteUserMessagesInGuildByTime task', {payload: validated});

	const guildId = createGuildID(BigInt(validated.guildId));
	const userId = createUserID(BigInt(validated.userId));
	const {days} = validated;

	Logger.debug(
		{guildId: guildId.toString(), userId: userId.toString(), days},
		'Starting time-based message deletion for guild ban',
	);

	try {
		const {channelService} = getWorkerDependencies();
		await channelService.deleteUserMessagesInGuild({guildId, userId, days});

		Logger.debug(
			{guildId: guildId.toString(), userId: userId.toString(), days},
			'Time-based message deletion completed successfully',
		);
	} catch (error) {
		Logger.error(
			{guildId: guildId.toString(), userId: userId.toString(), days, error},
			'Failed to delete user messages in guild',
		);
		throw error;
	}
};

export default deleteUserMessagesInGuildByTime;
