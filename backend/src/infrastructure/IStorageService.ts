/*
 * SPDX-License-Identifier: AGPL-3.0-or-later
 * Copyright (C) 2020-2026 Fluxer Contributors
 * Copyright (C) 2026 Floodilka Contributors
 * Modified by Floodilka Contributors starting March 2026. See LICENSE and NOTICE.
 */

import type {Readable} from 'node:stream';

export interface IStorageService {
	uploadObject(params: {
		bucket: string;
		key: string;
		body: Uint8Array;
		contentType?: string;
		expiresAt?: Date;
	}): Promise<void>;

	deleteObject(bucket: string, key: string): Promise<void>;

	getObjectMetadata(bucket: string, key: string): Promise<{contentLength: number; contentType: string} | null>;

	readObject(bucket: string, key: string): Promise<Uint8Array>;

	streamObject(params: {bucket: string; key: string; range?: string}): Promise<{
		body: Readable;
		contentLength: number;
		contentRange?: string | null;
		contentType?: string | null;
		cacheControl?: string | null;
		contentDisposition?: string | null;
		expires?: Date | null;
		etag?: string | null;
		lastModified?: Date | null;
	} | null>;

	writeObjectToDisk(bucket: string, key: string, filePath: string): Promise<void>;

	copyObject(params: {
		sourceBucket: string;
		sourceKey: string;
		destinationBucket: string;
		destinationKey: string;
		newContentType?: string;
	}): Promise<void>;

	copyObjectWithJpegProcessing(params: {
		sourceBucket: string;
		sourceKey: string;
		destinationBucket: string;
		destinationKey: string;
		contentType: string;
	}): Promise<{width: number; height: number} | null>;

	moveObject(params: {
		sourceBucket: string;
		sourceKey: string;
		destinationBucket: string;
		destinationKey: string;
		newContentType?: string;
	}): Promise<void>;

	getPresignedDownloadURL(params: {bucket: string; key: string; expiresIn?: number}): Promise<string>;

	createBucket(bucket: string, allowPublicAccess?: boolean): Promise<void>;

	purgeBucket(bucket: string): Promise<void>;

	uploadAvatar(params: {prefix: string; key: string; body: Uint8Array}): Promise<void>;

	deleteAvatar(params: {prefix: string; key: string}): Promise<void>;
}
