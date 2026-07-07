/*
 * SPDX-License-Identifier: AGPL-3.0-or-later
 * Copyright (C) 2020-2026 Fluxer Contributors
 * Copyright (C) 2026 Floodilka Contributors
 * Modified by Floodilka Contributors starting March 2026. See LICENSE and NOTICE.
 */

export interface ISMSService {
	startVerification(phone: string): Promise<void>;
	checkVerification(phone: string, code: string): Promise<boolean>;
}

export interface SentSmsCodeRecord {
	phone: string;
	code: string;
	timestamp: Date;
}

export interface ITestSMSService extends ISMSService {
	listSentCodes(): Array<SentSmsCodeRecord>;
	clearSentCodes(): void;
}
