/*
 * SPDX-License-Identifier: AGPL-3.0-or-later
 * Copyright (C) 2020-2026 Fluxer Contributors
 * Copyright (C) 2026 Floodilka Contributors
 * Modified by Floodilka Contributors starting March 2026. See LICENSE and NOTICE.
 */

import type {UserID} from '~/BrandedTypes';
import type {UserHarvestRow} from '~/database/CassandraTypes';

export class UserHarvest {
	userId: UserID;
	harvestId: bigint;
	requestedAt: Date;
	startedAt: Date | null;
	completedAt: Date | null;
	failedAt: Date | null;
	storageKey: string | null;
	fileSize: bigint | null;
	progressPercent: number;
	progressStep: string | null;
	errorMessage: string | null;
	downloadUrlExpiresAt: Date | null;

	constructor(row: UserHarvestRow) {
		this.userId = row.user_id;
		this.harvestId = row.harvest_id;
		this.requestedAt = row.requested_at;
		this.startedAt = row.started_at ?? null;
		this.completedAt = row.completed_at ?? null;
		this.failedAt = row.failed_at ?? null;
		this.storageKey = row.storage_key ?? null;
		this.fileSize = row.file_size ?? null;
		this.progressPercent = row.progress_percent;
		this.progressStep = row.progress_step ?? null;
		this.errorMessage = row.error_message ?? null;
		this.downloadUrlExpiresAt = row.download_url_expires_at ?? null;
	}

	toRow(): UserHarvestRow {
		return {
			user_id: this.userId,
			harvest_id: this.harvestId,
			requested_at: this.requestedAt,
			started_at: this.startedAt,
			completed_at: this.completedAt,
			failed_at: this.failedAt,
			storage_key: this.storageKey,
			file_size: this.fileSize,
			progress_percent: this.progressPercent,
			progress_step: this.progressStep,
			error_message: this.errorMessage,
			download_url_expires_at: this.downloadUrlExpiresAt,
		};
	}

	toResponse(): {
		harvest_id: string;
		requested_at: string;
		started_at: string | null;
		completed_at: string | null;
		failed_at: string | null;
		file_size: string | null;
		progress_percent: number;
		progress_step: string | null;
		error_message: string | null;
		download_url_expires_at: string | null;
	} {
		return {
			harvest_id: this.harvestId.toString(),
			requested_at: this.requestedAt.toISOString(),
			started_at: this.startedAt?.toISOString() ?? null,
			completed_at: this.completedAt?.toISOString() ?? null,
			failed_at: this.failedAt?.toISOString() ?? null,
			file_size: this.fileSize?.toString() ?? null,
			progress_percent: this.progressPercent,
			progress_step: this.progressStep,
			error_message: this.errorMessage,
			download_url_expires_at: this.downloadUrlExpiresAt?.toISOString() ?? null,
		};
	}
}

export type UserHarvestResponse = ReturnType<UserHarvest['toResponse']>;
