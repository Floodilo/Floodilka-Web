/*
 * SPDX-License-Identifier: AGPL-3.0-or-later
 * Copyright (C) 2020-2026 Fluxer Contributors
 * Copyright (C) 2026 Floodilka Contributors
 * Modified by Floodilka Contributors starting March 2026. See LICENSE and NOTICE.
 */

import {S3ServiceException} from '@aws-sdk/client-s3';
import type archiver from 'archiver';

import {Config} from '~/Config';
import {StickerFormatTypes} from '~/constants/Guild';
import type {StorageService} from '~/infrastructure/StorageService';
import {Logger} from '~/Logger';

const CDN_BUCKET = Config.s3.buckets.cdn;

const stripAnimationPrefix = (hash: string): string => (hash.startsWith('a_') ? hash.slice(2) : hash);

export const buildHashedAssetKey = (prefix: string, entityId: string, hash: string): string =>
	`${prefix}/${entityId}/${stripAnimationPrefix(hash)}`;

export const buildSimpleAssetKey = (prefix: string, key: string): string => `${prefix}/${key}`;

export const getAnimatedAssetExtension = (hash: string): 'gif' | 'png' => (hash.startsWith('a_') ? 'gif' : 'png');

export const getEmojiExtension = (animated: boolean): 'gif' | 'webp' => (animated ? 'gif' : 'webp');

export const getStickerExtension = (formatType: number): 'gif' | 'webp' =>
	formatType === StickerFormatTypes.GIF ? 'gif' : 'webp';

const readCdnAssetIfExists = async (storageService: StorageService, key: string): Promise<Buffer | null> => {
	try {
		const data = await storageService.readObject(CDN_BUCKET, key);
		return Buffer.from(data);
	} catch (error) {
		if (error instanceof S3ServiceException && error.name === 'NoSuchKey') {
			return null;
		}
		throw error;
	}
};

export interface AppendAssetToArchiveParams {
	archive: archiver.Archiver;
	storageService: StorageService;
	storageKey: string;
	archiveName: string;
	label: string;
	subjectId: string;
}

export const appendAssetToArchive = async ({
	archive,
	storageService,
	storageKey,
	archiveName,
	label,
	subjectId,
}: AppendAssetToArchiveParams): Promise<void> => {
	const buffer = await readCdnAssetIfExists(storageService, storageKey);
	if (!buffer) {
		Logger.warn({subjectId, storageKey}, `Skipping missing ${label}`);
		return;
	}

	archive.append(buffer, {name: archiveName});
};
