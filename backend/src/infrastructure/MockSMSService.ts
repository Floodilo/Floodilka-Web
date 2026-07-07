/*
 * SPDX-License-Identifier: AGPL-3.0-or-later
 * Copyright (C) 2020-2026 Fluxer Contributors
 * Copyright (C) 2026 Floodilka Contributors
 * Modified by Floodilka Contributors starting March 2026. See LICENSE and NOTICE.
 */

import crypto from 'node:crypto';
import type {ICacheService} from '~/infrastructure/ICacheService';
import type {ITestSMSService, SentSmsCodeRecord} from '~/infrastructure/ISMSService';
import {Logger} from '~/Logger';

const OTP_TTL_SECONDS = 600;
const OTP_MAX_ATTEMPTS = 5;
const OTP_CACHE_PREFIX = 'mock_sms_otp:';
const SENT_CODES_MAX_RECORDS = 100;

interface StoredOtp {
	code: string;
	attempts: number;
}

// Development/QA stand-in for a real SMS provider: generates and validates
// codes locally and logs them instead of sending. A real provider (sms.ru,
// SMSC, etc.) replaces this behind the same ISMSService interface.
export class MockSMSService implements ITestSMSService {
	private sentCodes: Array<SentSmsCodeRecord> = [];

	constructor(private cacheService: ICacheService) {}

	async startVerification(phone: string): Promise<void> {
		const code = crypto.randomInt(100000, 999999).toString();
		const stored: StoredOtp = {code, attempts: 0};
		await this.cacheService.set(`${OTP_CACHE_PREFIX}${phone}`, stored, OTP_TTL_SECONDS);

		this.sentCodes.push({phone, code, timestamp: new Date()});
		if (this.sentCodes.length > SENT_CODES_MAX_RECORDS) {
			this.sentCodes.splice(0, this.sentCodes.length - SENT_CODES_MAX_RECORDS);
		}

		Logger.info({phone}, `[MockSMSService] Verification code for ${phone}: ${code}`);
	}

	async checkVerification(phone: string, code: string): Promise<boolean> {
		const key = `${OTP_CACHE_PREFIX}${phone}`;
		const stored = await this.cacheService.get<StoredOtp>(key);
		if (!stored) {
			return false;
		}

		if (stored.attempts >= OTP_MAX_ATTEMPTS) {
			await this.cacheService.delete(key);
			return false;
		}

		if (stored.code !== code) {
			stored.attempts += 1;
			const remainingTtl = await this.cacheService.ttl(key);
			await this.cacheService.set(key, stored, remainingTtl > 0 ? remainingTtl : OTP_TTL_SECONDS);
			return false;
		}

		await this.cacheService.delete(key);
		return true;
	}

	listSentCodes(): Array<SentSmsCodeRecord> {
		return [...this.sentCodes];
	}

	clearSentCodes(): void {
		this.sentCodes = [];
	}
}
