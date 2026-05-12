/*
 * SPDX-License-Identifier: AGPL-3.0-or-later
 * Copyright (C) 2020-2026 Fluxer Contributors
 * Copyright (C) 2026 Floodilka Contributors
 * Modified by Floodilka Contributors starting March 2026. See LICENSE and NOTICE.
 */

import type {FavoriteMemeRow} from '~/database/CassandraTypes';
import {extractTimestamp} from '~/utils/SnowflakeUtils';
import {type AttachmentID, type MemeID, type UserID, userIdToChannelId} from '../BrandedTypes';

export class FavoriteMeme {
	readonly id: MemeID;
	readonly userId: UserID;
	readonly name: string;
	readonly altText: string | null;
	readonly tags: Array<string>;
	readonly attachmentId: AttachmentID;
	readonly filename: string;
	readonly contentType: string;
	readonly contentHash: string | null;
	readonly size: bigint;
	readonly width: number | null;
	readonly height: number | null;
	readonly duration: number | null;
	readonly isGifv: boolean;
	readonly klipyId: string | null;
	readonly createdAt: Date;
	readonly version: number;

	constructor(row: FavoriteMemeRow) {
		this.id = row.meme_id;
		this.userId = row.user_id;
		this.name = row.name;
		this.altText = row.alt_text ?? null;
		this.tags = row.tags ?? [];
		this.attachmentId = row.attachment_id;
		this.filename = row.filename;
		this.contentType = row.content_type;
		this.contentHash = row.content_hash ?? null;
		this.size = row.size;
		this.width = row.width ?? null;
		this.height = row.height ?? null;
		this.duration = row.duration ?? null;
		this.isGifv = row.is_gifv ?? false;
		this.klipyId = row.klipy_id ?? null;
		this.createdAt = new Date(extractTimestamp(this.id));
		this.version = row.version;
	}

	toRow(): FavoriteMemeRow {
		return {
			user_id: this.userId,
			meme_id: this.id,
			name: this.name,
			alt_text: this.altText,
			tags: this.tags.length > 0 ? this.tags : null,
			attachment_id: this.attachmentId,
			filename: this.filename,
			content_type: this.contentType,
			content_hash: this.contentHash,
			size: this.size,
			width: this.width,
			height: this.height,
			duration: this.duration,
			is_gifv: this.isGifv,
			klipy_id: this.klipyId,
			version: this.version,
		};
	}

	get storageKey(): string {
		const channelId = userIdToChannelId(this.userId);
		return `attachments/${channelId}/${this.attachmentId}/${this.filename}`;
	}
}
