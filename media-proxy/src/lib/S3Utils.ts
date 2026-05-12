/*
 * SPDX-License-Identifier: AGPL-3.0-or-later
 * Copyright (C) 2020-2026 Fluxer Contributors
 * Copyright (C) 2026 Floodilka Contributors
 * Modified by Floodilka Contributors starting March 2026. See LICENSE and NOTICE.
 */

import assert from 'node:assert/strict';
import {Readable} from 'node:stream';
import {GetObjectCommand, HeadObjectCommand, S3Client, S3ServiceException} from '@aws-sdk/client-s3';
import {NodeHttpHandler} from '@smithy/node-http-handler';
import {HTTPException} from 'hono/http-exception';
import {Config} from '~/Config';
import * as metrics from '~/lib/MetricsClient';

const MAX_STREAM_BYTES = 500 * 1024 * 1024;

export const s3Client = new S3Client({
	endpoint: Config.AWS_S3_ENDPOINT,
	region: 'us-east-1',
	forcePathStyle: true,
	credentials: {
		accessKeyId: Config.AWS_ACCESS_KEY_ID,
		secretAccessKey: Config.AWS_SECRET_ACCESS_KEY,
	},
	requestChecksumCalculation: 'WHEN_REQUIRED',
	responseChecksumValidation: 'WHEN_REQUIRED',
	requestHandler: new NodeHttpHandler({
		socketTimeout: 300_000,
		connectionTimeout: 5_000,
	}),
});

export interface S3HeadResult {
	contentLength: number;
	contentType: string;
	lastModified?: Date;
}

export const headS3Object = async (bucket: string, key: string): Promise<S3HeadResult> => {
	const start = Date.now();
	try {
		const command = new HeadObjectCommand({
			Bucket: bucket,
			Key: key,
		});

		const {ContentLength, ContentType, LastModified} = await s3Client.send(command);

		metrics.histogram({
			name: 'media_proxy.upstream.latency',
			dimensions: {operation: 'head'},
			valueMs: Date.now() - start,
		});

		return {
			contentLength: ContentLength ?? 0,
			contentType: ContentType ?? 'application/octet-stream',
			lastModified: LastModified,
		};
	} catch (error) {
		metrics.histogram({
			name: 'media_proxy.upstream.latency',
			dimensions: {operation: 'head'},
			valueMs: Date.now() - start,
		});
		if (error instanceof S3ServiceException) {
			metrics.counter({
				name: 'media_proxy.s3.error',
				dimensions: {operation: 'head', error_type: error.name},
			});
			if (error.name === 'NotFound') {
				throw new HTTPException(404);
			}
		}
		throw error;
	}
};

export const readS3Object = async (
	bucket: string,
	key: string,
	range?: {start: number; end: number},
	client: S3Client = s3Client,
) => {
	const start = Date.now();
	try {
		const command = new GetObjectCommand({
			Bucket: bucket,
			Key: key,
			Range: range ? `bytes=${range.start}-${range.end}` : undefined,
		});

		const {Body, ContentLength, LastModified, ContentType} = await client.send(command);
		assert(Body != null && ContentType != null);

		if (range) {
			assert(Body instanceof Readable);
			metrics.histogram({
				name: 'media_proxy.upstream.latency',
				dimensions: {operation: 'read'},
				valueMs: Date.now() - start,
			});
			return {data: Body as Readable, size: ContentLength || 0, contentType: ContentType, lastModified: LastModified};
		}

		const chunks: Array<Buffer> = [];
		let totalSize = 0;

		assert(Body instanceof Readable);

		for await (const chunk of Body) {
			totalSize += chunk.length;
			if (totalSize > MAX_STREAM_BYTES) throw new HTTPException(413);
			chunks.push(chunk);
		}

		metrics.histogram({
			name: 'media_proxy.upstream.latency',
			dimensions: {operation: 'read'},
			valueMs: Date.now() - start,
		});
		return {data: Buffer.concat(chunks), size: totalSize, contentType: ContentType, lastModified: LastModified};
	} catch (error) {
		metrics.histogram({
			name: 'media_proxy.upstream.latency',
			dimensions: {operation: 'read'},
			valueMs: Date.now() - start,
		});
		if (error instanceof S3ServiceException) {
			metrics.counter({
				name: 'media_proxy.s3.error',
				dimensions: {operation: 'read', error_type: error.name},
			});
			if (error.name === 'NoSuchKey') {
				throw new HTTPException(404);
			}
		}
		throw error;
	}
};

export const streamS3Object = async (bucket: string, key: string) => {
	const start = Date.now();
	try {
		const command = new GetObjectCommand({
			Bucket: bucket,
			Key: key,
		});

		const {Body, ContentLength, LastModified, ContentType} = await s3Client.send(command);
		assert(Body != null && ContentType != null);

		assert(Body instanceof Readable, 'Expected S3 response body to be a stream');

		metrics.histogram({
			name: 'media_proxy.upstream.latency',
			dimensions: {operation: 'stream'},
			valueMs: Date.now() - start,
		});
		return {stream: Body as Readable, size: ContentLength || 0, contentType: ContentType, lastModified: LastModified};
	} catch (error) {
		metrics.histogram({
			name: 'media_proxy.upstream.latency',
			dimensions: {operation: 'stream'},
			valueMs: Date.now() - start,
		});
		if (error instanceof S3ServiceException) {
			metrics.counter({
				name: 'media_proxy.s3.error',
				dimensions: {operation: 'stream', error_type: error.name},
			});
			if (error.name === 'NoSuchKey') {
				throw new HTTPException(404);
			}
		}
		throw error;
	}
};

export const streamToBuffer = async (stream: NodeJS.ReadableStream): Promise<Buffer> => {
	const chunks: Array<Buffer> = [];
	let totalSize = 0;

	for await (const chunk of stream) {
		const buffer = Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk);
		totalSize += buffer.length;
		if (totalSize > MAX_STREAM_BYTES) throw new HTTPException(413);
		chunks.push(buffer);
	}

	return Buffer.concat(chunks);
};
