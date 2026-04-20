/*
 * Copyright (C) 2026 Floodilka Contributors
 *
 * This file is part of Floodilka.
 *
 * Floodilka is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * Floodilka is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
 * GNU Affero General Public License for more details.
 *
 * You should have received a copy of the GNU Affero General Public License
 * along with Floodilka. If not, see <https://www.gnu.org/licenses/>.
 */

import {HeadObjectCommand, ListObjectsV2Command, PutObjectCommand, S3Client} from '@aws-sdk/client-s3';
import {Config} from '~/Config';
import {Logger} from '~/Logger';
import {transcodeToAnimatedWebp} from '~/utils/FfmpegUtils';

const BANNER_TARGETS = {
	user: {width: 1530, height: 540, maxSeconds: 6},
	guild: {width: 1920, height: 1080, maxSeconds: 6},
	guildMember: {width: 1530, height: 540, maxSeconds: 6},
};

const NAMEPLATE_TARGET = {width: 480, height: 160, maxSeconds: 6};

const DEFAULT_CONCURRENCY = 4;

interface BackfillOptions {
	dryRun: boolean;
	deleteMp4: boolean;
	concurrency: number;
	prefixFilter: 'all' | 'banners' | 'nameplates';
}

const parseArgs = (): BackfillOptions => {
	const argv = process.argv.slice(2);
	return {
		dryRun: argv.includes('--dry-run'),
		deleteMp4: argv.includes('--delete-mp4'),
		concurrency: Number(argv.find((a) => a.startsWith('--concurrency='))?.split('=')[1] ?? DEFAULT_CONCURRENCY),
		prefixFilter:
			(argv.find((a) => a.startsWith('--only='))?.split('=')[1] as BackfillOptions['prefixFilter']) ?? 'all',
	};
};

const makeS3 = () =>
	new S3Client({
		endpoint: Config.s3.endpoint,
		region: 'us-east-1',
		credentials: {
			accessKeyId: Config.s3.accessKeyId,
			secretAccessKey: Config.s3.secretAccessKey,
		},
		requestChecksumCalculation: 'WHEN_REQUIRED',
		responseChecksumValidation: 'WHEN_REQUIRED',
		forcePathStyle: true,
	});

async function* enumerateMp4Keys(s3: S3Client, bucket: string, prefix: string): AsyncGenerator<string> {
	let continuationToken: string | undefined;
	do {
		const resp = await s3.send(
			new ListObjectsV2Command({
				Bucket: bucket,
				Prefix: prefix,
				ContinuationToken: continuationToken,
			}),
		);
		for (const obj of resp.Contents ?? []) {
			if (obj.Key && obj.Key.endsWith('.mp4')) {
				yield obj.Key;
			}
		}
		continuationToken = resp.IsTruncated ? resp.NextContinuationToken : undefined;
	} while (continuationToken);
}

async function webpExists(s3: S3Client, bucket: string, webpKey: string): Promise<boolean> {
	try {
		await s3.send(new HeadObjectCommand({Bucket: bucket, Key: webpKey}));
		return true;
	} catch (error) {
		const code = (error as {name?: string}).name;
		if (code === 'NotFound' || code === 'NoSuchKey') return false;
		throw error;
	}
}

function pickTarget(
	mp4Key: string,
): {width: number; height: number; maxSeconds: number; kind: 'banner' | 'nameplate'} | null {
	if (mp4Key.startsWith('banners/')) {
		return {...BANNER_TARGETS.user, kind: 'banner'};
	}
	if (mp4Key.startsWith('guilds/') && mp4Key.includes('/banners/')) {
		return {...BANNER_TARGETS.guild, kind: 'banner'};
	}
	if (mp4Key.startsWith('guilds/') && mp4Key.includes('/users/') && mp4Key.includes('/banners/')) {
		return {...BANNER_TARGETS.guildMember, kind: 'banner'};
	}
	if (mp4Key.startsWith('nameplates/')) {
		return {...NAMEPLATE_TARGET, kind: 'nameplate'};
	}
	return null;
}

async function processOne(
	s3: S3Client,
	bucket: string,
	mp4Key: string,
	options: BackfillOptions,
): Promise<'converted' | 'skipped' | 'failed'> {
	const webpKey = mp4Key.replace(/\.mp4$/, '.webp');
	const target = pickTarget(mp4Key);
	if (!target) {
		Logger.warn({mp4Key}, 'Unknown prefix, skipping');
		return 'skipped';
	}

	if (await webpExists(s3, bucket, webpKey)) {
		return 'skipped';
	}

	if (options.dryRun) {
		Logger.info({mp4Key, webpKey, target: target.kind}, '[dry-run] would convert');
		return 'converted';
	}

	try {
		const obj = await s3.send(
			new (await import('@aws-sdk/client-s3')).GetObjectCommand({Bucket: bucket, Key: mp4Key}),
		);
		const mp4Bytes = await obj.Body?.transformToByteArray();
		if (!mp4Bytes) {
			Logger.error({mp4Key}, 'Empty MP4 body');
			return 'failed';
		}

		const result = await transcodeToAnimatedWebp({
			input: mp4Bytes,
			targetWidth: target.width,
			targetHeight: target.height,
			maxDurationSeconds: target.maxSeconds,
		});

		await s3.send(
			new PutObjectCommand({
				Bucket: bucket,
				Key: webpKey,
				Body: result.webp,
				ContentType: 'image/webp',
			}),
		);

		Logger.info(
			{mp4Key, webpKey, mp4Bytes: mp4Bytes.length, webpBytes: result.webp.length},
			'Converted MP4 → WebP',
		);

		if (options.deleteMp4) {
			await s3.send(
				new (await import('@aws-sdk/client-s3')).DeleteObjectCommand({Bucket: bucket, Key: mp4Key}),
			);
			Logger.info({mp4Key}, 'Deleted MP4');
		}

		return 'converted';
	} catch (error) {
		Logger.error({error, mp4Key}, 'Conversion failed');
		return 'failed';
	}
}

async function processConcurrent<T, R>(
	items: AsyncGenerator<T>,
	concurrency: number,
	worker: (item: T) => Promise<R>,
): Promise<Array<R>> {
	const results: Array<R> = [];
	const active: Set<Promise<void>> = new Set();

	for await (const item of items) {
		if (active.size >= concurrency) {
			await Promise.race(active);
		}
		const task = worker(item).then((r) => {
			results.push(r);
			active.delete(task);
		});
		active.add(task);
	}
	await Promise.all(active);
	return results;
}

async function run(): Promise<void> {
	const options = parseArgs();
	Logger.info({options}, 'Starting MP4 → WebP backfill');

	const s3 = makeS3();
	const bucket = Config.s3.buckets.cdn;

	const prefixes: Array<string> = [];
	if (options.prefixFilter === 'all' || options.prefixFilter === 'banners') {
		prefixes.push('banners/', 'guilds/');
	}
	if (options.prefixFilter === 'all' || options.prefixFilter === 'nameplates') {
		prefixes.push('nameplates/');
	}

	const counts = {converted: 0, skipped: 0, failed: 0};

	for (const prefix of prefixes) {
		Logger.info({prefix}, 'Scanning prefix');
		const results = await processConcurrent(
			enumerateMp4Keys(s3, bucket, prefix),
			options.concurrency,
			(key) => processOne(s3, bucket, key, options),
		);
		for (const r of results) counts[r]++;
	}

	Logger.info(counts, 'Backfill finished');
}

run().catch((error) => {
	Logger.error({error}, 'Backfill crashed');
	process.exit(1);
});
