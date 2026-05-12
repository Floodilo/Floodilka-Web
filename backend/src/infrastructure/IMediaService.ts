/*
 * SPDX-License-Identifier: AGPL-3.0-or-later
 * Copyright (C) 2020-2026 Fluxer Contributors
 * Copyright (C) 2026 Floodilka Contributors
 * Modified by Floodilka Contributors starting March 2026. See LICENSE and NOTICE.
 */

export type MediaProxyMetadataRequest =
	| {
			type: 'external';
			url: string;
			with_base64?: boolean;
			isNSFWAllowed: boolean;
	  }
	| {
			type: 'upload';
			upload_filename: string;
			isNSFWAllowed: boolean;
	  }
	| {
			type: 'base64';
			base64: string;
			isNSFWAllowed: boolean;
	  }
	| {
			type: 's3';
			bucket: string;
			key: string;
			with_base64?: boolean;
			isNSFWAllowed: boolean;
	  };

export interface MediaProxyMetadataResponse {
	format: string;
	content_type: string;
	content_hash: string;
	size: number;
	width?: number;
	height?: number;
	duration?: number;
	placeholder?: string;
	base64?: string;
	animated?: boolean;
	nsfw: boolean;
	nsfw_probability?: number;
	nsfw_predictions?: Record<string, number>;
}

export abstract class IMediaService {
	abstract getMetadata(request: MediaProxyMetadataRequest): Promise<MediaProxyMetadataResponse | null>;
	abstract getExternalMediaProxyURL(url: string): string;
	abstract getThumbnail(uploadFilename: string): Promise<Buffer | null>;
}
