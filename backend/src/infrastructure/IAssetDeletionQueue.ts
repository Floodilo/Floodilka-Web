/*
 * SPDX-License-Identifier: AGPL-3.0-or-later
 * Copyright (C) 2020-2026 Fluxer Contributors
 * Copyright (C) 2026 Floodilka Contributors
 * Modified by Floodilka Contributors starting March 2026. See LICENSE and NOTICE.
 */

export interface QueuedAssetDeletion {
	s3Key: string;
	cdnUrl: string | null;
	reason: string;
	queuedAt?: number;
	retryCount?: number;
}

export interface DeletionQueueProcessResult {
	deleted: number;
	requeued: number;
	failed: number;
	remaining: number;
}

export interface IAssetDeletionQueue {
	queueDeletion(item: Omit<QueuedAssetDeletion, 'queuedAt' | 'retryCount'>): Promise<void>;

	queueCloudflarePurge(cdnUrl: string): Promise<void>;

	getBatch(count: number): Promise<Array<QueuedAssetDeletion>>;

	requeueItem(item: QueuedAssetDeletion): Promise<void>;

	getQueueSize(): Promise<number>;

	clear(): Promise<void>;
}
