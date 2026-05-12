/*
 * SPDX-License-Identifier: AGPL-3.0-or-later
 * Copyright (C) 2020-2026 Fluxer Contributors
 * Copyright (C) 2026 Floodilka Contributors
 * Modified by Floodilka Contributors starting March 2026. See LICENSE and NOTICE.
 */

import crypto from 'node:crypto';
import type {IVirusScanService, VirusScanResult} from './IVirusScanService';

export class DisabledVirusScanService implements IVirusScanService {
	private cachedVirusHashes = new Set<string>();

	async initialize(): Promise<void> {}

	async scanFile(filePath: string): Promise<VirusScanResult> {
		const fileHash = crypto.createHash('sha256').update(filePath).digest('hex');
		return {
			isClean: true,
			fileHash,
		};
	}

	async scanBuffer(buffer: Buffer, _filename: string): Promise<VirusScanResult> {
		const fileHash = crypto.createHash('sha256').update(buffer).digest('hex');

		return {
			isClean: true,
			fileHash,
		};
	}

	async isVirusHashCached(fileHash: string): Promise<boolean> {
		return this.cachedVirusHashes.has(fileHash);
	}

	async cacheVirusHash(fileHash: string): Promise<void> {
		this.cachedVirusHashes.add(fileHash);
	}
}
