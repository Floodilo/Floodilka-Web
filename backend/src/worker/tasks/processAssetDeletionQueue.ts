/*
 * SPDX-License-Identifier: AGPL-3.0-or-later
 * Copyright (C) 2020-2026 Fluxer Contributors
 * Copyright (C) 2026 Floodilka Contributors
 * Modified by Floodilka Contributors starting March 2026. See LICENSE and NOTICE.
 */

import type {Task} from '~/worker/TaskTypes';
import {Config} from '~/Config';
import type {AssetDeletionQueue} from '~/infrastructure/AssetDeletionQueue';
import type {CloudflarePurgeQueue, NoopCloudflarePurgeQueue} from '~/infrastructure/CloudflarePurgeQueue';
import type {QueuedAssetDeletion} from '~/infrastructure/IAssetDeletionQueue';
import type {StorageService} from '~/infrastructure/StorageService';
import {Logger} from '~/Logger';
import {getWorkerDependencies} from '../WorkerContext';

const BATCH_SIZE = 50;
const MAX_ITEMS_PER_RUN = 500;

const processAssetDeletionQueue: Task = async (_payload, _helpers) => {
	const {assetDeletionQueue, cloudflarePurgeQueue, storageService} = getWorkerDependencies();

	const queueSize = await assetDeletionQueue.getQueueSize();
	if (queueSize === 0) {
		Logger.debug('Asset deletion queue is empty');
		return;
	}

	Logger.info({queueSize}, 'Starting asset deletion queue processing');

	let totalProcessed = 0;
	let totalDeleted = 0;
	let totalFailed = 0;
	let totalCdnPurged = 0;

	while (totalProcessed < MAX_ITEMS_PER_RUN) {
		const batch = await assetDeletionQueue.getBatch(BATCH_SIZE);
		if (batch.length === 0) {
			break;
		}

		const results = await Promise.allSettled(
			batch.map((item) => processItem(item, storageService, cloudflarePurgeQueue, assetDeletionQueue)),
		);

		for (let i = 0; i < results.length; i++) {
			const result = results[i];
			const item = batch[i];

			if (result.status === 'fulfilled') {
				totalDeleted++;
				if (item.cdnUrl) {
					totalCdnPurged++;
				}
			} else {
				totalFailed++;
				Logger.error(
					{error: result.reason, s3Key: item.s3Key, cdnUrl: item.cdnUrl},
					'Failed to process asset deletion',
				);
			}
		}

		totalProcessed += batch.length;
	}

	const remainingSize = await assetDeletionQueue.getQueueSize();

	Logger.info(
		{
			totalProcessed,
			totalDeleted,
			totalFailed,
			totalCdnPurged,
			remainingSize,
		},
		'Finished asset deletion queue processing',
	);
};

async function processItem(
	item: QueuedAssetDeletion,
	storageService: StorageService,
	cloudflarePurgeQueue: CloudflarePurgeQueue | NoopCloudflarePurgeQueue,
	assetDeletionQueue: AssetDeletionQueue,
): Promise<void> {
	try {
		if (item.s3Key) {
			try {
				await storageService.deleteObject(Config.s3.buckets.cdn, item.s3Key);
				Logger.debug({s3Key: item.s3Key, reason: item.reason}, 'Deleted asset from S3');
			} catch (error: unknown) {
				const isNotFound =
					error instanceof Error &&
					(('name' in error && error.name === 'NotFound') ||
						('code' in error && (error as {code?: string}).code === 'NoSuchKey'));

				if (!isNotFound) {
					throw error;
				}
				Logger.debug({s3Key: item.s3Key}, 'Asset already deleted from S3 (NotFound)');
			}
		}

		if (item.cdnUrl && cloudflarePurgeQueue) {
			await cloudflarePurgeQueue.addUrls([item.cdnUrl]);
			Logger.debug({cdnUrl: item.cdnUrl}, 'Queued asset CDN URL for Cloudflare purge');
		}
	} catch (error) {
		await assetDeletionQueue.requeueItem(item);
		throw error;
	}
}

export default processAssetDeletionQueue;
