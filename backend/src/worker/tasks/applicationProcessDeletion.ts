/*
 * SPDX-License-Identifier: AGPL-3.0-or-later
 * Copyright (C) 2020-2026 Fluxer Contributors
 * Copyright (C) 2026 Floodilka Contributors
 * Modified by Floodilka Contributors starting March 2026. See LICENSE and NOTICE.
 */

import type {Task} from '~/worker/TaskTypes';
import {applicationIdToUserId, createApplicationID} from '~/BrandedTypes';
import {UserFlags} from '~/Constants';
import {mapGuildMemberToResponse} from '~/guild/GuildModel';
import {Logger} from '~/Logger';
import type {RequestCache} from '~/middleware/RequestCacheMiddleware';
import {randomString} from '~/utils/RandomUtils';
import {validatePayload} from '../utils/TaskPayloadValidator';
import {getWorkerDependencies} from '../WorkerContext';
import {chunkArray} from './utils/messageDeletion';

interface ApplicationProcessDeletionPayload {
	applicationId: string;
}

const payloadSchema = {
	applicationId: {type: 'string' as const, requirement: 'required' as const},
};

function createRequestCache(): RequestCache {
	return {
		userPartials: new Map(),
		clear: () => {},
	};
}

const CHUNK_SIZE = 50;
const DELAY_MS = 100;

const applicationProcessDeletion: Task = async (payload, helpers) => {
	const validated = validatePayload<ApplicationProcessDeletionPayload>(payload, payloadSchema);
	helpers.logger.debug('Processing applicationProcessDeletion task', {payload: validated});

	const applicationId = createApplicationID(BigInt(validated.applicationId));
	const botUserId = applicationIdToUserId(applicationId);

	const {
		userRepository,
		guildRepository,
		applicationRepository,
		userCacheService,
		gatewayService,
	} = getWorkerDependencies();

	Logger.debug({applicationId, botUserId}, 'Starting application deletion');

	try {
		const application = await applicationRepository.getApplication(applicationId);
		if (!application) {
			Logger.warn({applicationId}, 'Application not found, skipping deletion (already deleted)');
			return;
		}

		const botUser = await userRepository.findUnique(botUserId);
		if (!botUser) {
			Logger.warn({applicationId, botUserId}, 'Bot user not found, skipping deletion');
			return;
		}

		if (botUser.flags & UserFlags.DELETED) {
			Logger.info({applicationId, botUserId}, 'Bot user already marked as deleted, skipping');
			await applicationRepository.deleteApplication(applicationId);
			return;
		}

		const foundUsername = `DeletedBot${randomString(8)}`;

		Logger.debug(
			{applicationId, botUserId, newUsername: foundUsername},
			'Generated deleted bot username',
		);

		await userRepository.patchUpsert(botUserId, {
			username: foundUsername,
			flags: botUser.flags | UserFlags.DELETED,
		});

		Logger.debug({applicationId, botUserId}, 'Updated bot user to deleted state');

		const guildIds = await userRepository.getUserGuildIds(botUserId);
		Logger.debug({applicationId, botUserId, guildCount: guildIds.length}, 'Found guilds bot is member of');

		const chunks = chunkArray(guildIds, CHUNK_SIZE);
		let processedGuilds = 0;

		for (const chunk of chunks) {
			await Promise.all(
				chunk.map(async (guildId) => {
					try {
						const member = await guildRepository.getMember(guildId, botUserId);
						if (!member) {
							Logger.debug({botUserId, guildId}, 'Member not found in guild, skipping');
							return;
						}

						const requestCache = createRequestCache();
						const botMemberResponse = await mapGuildMemberToResponse(member, userCacheService, requestCache);

						await gatewayService.dispatchGuild({
							guildId,
							event: 'GUILD_MEMBER_UPDATE',
							data: {
								guild_id: guildId.toString(),
								...botMemberResponse,
							},
						});

						Logger.debug({botUserId, guildId}, 'Dispatched GUILD_MEMBER_UPDATE for bot');
					} catch (error) {
						Logger.error({error, botUserId, guildId}, 'Failed to dispatch guild member update');
					}
				}),
			);

			processedGuilds += chunk.length;

			if (processedGuilds < guildIds.length) {
				await new Promise((resolve) => setTimeout(resolve, DELAY_MS));
			}

			Logger.info(
				{applicationId, botUserId, processedGuilds, totalGuilds: guildIds.length},
				'Application deletion: dispatched guild updates',
			);
		}

		Logger.debug({applicationId, botUserId, totalGuilds: guildIds.length}, 'Completed guild member updates');

		Logger.debug({applicationId}, 'Deleting application from database');
		await applicationRepository.deleteApplication(applicationId);

		Logger.info({applicationId, botUserId, guildCount: guildIds.length}, 'Application deletion completed successfully');
	} catch (error) {
		Logger.error({error, applicationId, botUserId}, 'Failed to delete application');
		throw error;
	}
};

export default applicationProcessDeletion;
