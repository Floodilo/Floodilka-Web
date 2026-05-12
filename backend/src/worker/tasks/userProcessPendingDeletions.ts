/*
 * SPDX-License-Identifier: AGPL-3.0-or-later
 * Copyright (C) 2020-2026 Fluxer Contributors
 * Copyright (C) 2026 Floodilka Contributors
 * Modified by Floodilka Contributors starting March 2026. See LICENSE and NOTICE.
 */

import type {Task} from '~/worker/TaskTypes';
import {createUserID} from '~/BrandedTypes';
import {UserFlags} from '~/Constants';
import {Logger} from '~/Logger';
import {getWorkerDependencies} from '../WorkerContext';

const userProcessPendingDeletions: Task = async (_payload, helpers) => {
	helpers.logger.debug('Processing userProcessPendingDeletions task');

	const {userRepository, workerService, deletionQueueService} = getWorkerDependencies();

	try {
		Logger.debug('Processing pending user deletions from Redis queue');

		const needsRebuild = await deletionQueueService.needsRebuild();
		if (needsRebuild) {
			Logger.info('Deletion queue needs rebuild, acquiring lock');
			const lockToken = await deletionQueueService.acquireRebuildLock();

			if (lockToken) {
				try {
					await deletionQueueService.rebuildState();
					await deletionQueueService.releaseRebuildLock(lockToken);
				} catch (error) {
					await deletionQueueService.releaseRebuildLock(lockToken);
					throw error;
				}
			} else {
				Logger.info('Another worker is rebuilding the queue, skipping this run');
				return;
			}
		}

		const nowMs = Date.now();
		const pendingDeletions = await deletionQueueService.getReadyDeletions(nowMs, 1000);

		Logger.debug({count: pendingDeletions.length}, 'Found users pending deletion from Redis');

		let scheduled = 0;
		for (const deletion of pendingDeletions) {
			try {
				const userId = createUserID(deletion.userId);

				const user = await userRepository.findUnique(userId);
				if (!user || !user.pendingDeletionAt) {
					Logger.warn({userId}, 'User not found or not pending deletion in Cassandra, removing from Redis');
					await deletionQueueService.removeFromQueue(userId);
					continue;
				}

				if (user.isBot) {
					Logger.info({userId}, 'User is a bot, skipping deletion');
					continue;
				}

				if (user.flags & UserFlags.APP_STORE_REVIEWER) {
					Logger.info({userId}, 'User is an app store reviewer, skipping deletion');
					continue;
				}

				await workerService.addJob('userProcessPendingDeletion', {
					userId: deletion.userId.toString(),
					deletionReasonCode: deletion.deletionReasonCode,
				});

				await deletionQueueService.removeFromQueue(userId);
				await userRepository.removePendingDeletion(userId, user.pendingDeletionAt);

				scheduled++;
			} catch (error) {
				Logger.error({error, userId: deletion.userId.toString()}, 'Failed to schedule user deletion');
			}
		}

		Logger.debug({scheduled, total: pendingDeletions.length}, 'Scheduled user deletion tasks');
	} catch (error) {
		Logger.error({error}, 'Failed to process pending deletions');
		throw error;
	}
};

export default userProcessPendingDeletions;
