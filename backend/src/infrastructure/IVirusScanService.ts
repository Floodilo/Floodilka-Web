/*
 * SPDX-License-Identifier: AGPL-3.0-or-later
 * Copyright (C) 2020-2026 Fluxer Contributors
 * Copyright (C) 2026 Floodilka Contributors
 * Modified by Floodilka Contributors starting March 2026. See LICENSE and NOTICE.
 */

export interface VirusScanResult {
	isClean: boolean;
	threat?: string;
	fileHash: string;
}

export abstract class IVirusScanService {
	abstract initialize(): Promise<void>;
	abstract scanFile(filePath: string): Promise<VirusScanResult>;
	abstract scanBuffer(buffer: Buffer, filename: string): Promise<VirusScanResult>;
	abstract isVirusHashCached(fileHash: string): Promise<boolean>;
	abstract cacheVirusHash(fileHash: string): Promise<void>;
}
