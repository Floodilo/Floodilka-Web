/*
 * SPDX-License-Identifier: AGPL-3.0-or-later
 * Copyright (C) 2020-2026 Fluxer Contributors
 * Copyright (C) 2026 Floodilka Contributors
 * Modified by Floodilka Contributors starting March 2026. See LICENSE and NOTICE.
 */

import {Config} from '~/Config';
import {FLOODILKA_USER_AGENT} from '~/Constants';
import type {ICaptchaService, VerifyCaptchaParams} from '~/infrastructure/ICaptchaService';
import {Logger} from '~/Logger';

interface HCaptchaVerifyResponse {
	success: boolean;
	challenge_ts?: string;
	hostname?: string;
	credit?: boolean;
	'error-codes'?: Array<string>;
	score?: number;
	score_reason?: Array<string>;
}

export class CaptchaService implements ICaptchaService {
	private readonly secretKey: string;
	private readonly verifyUrl = 'https://api.hcaptcha.com/siteverify';

	constructor() {
		if (!Config.captcha.hcaptcha?.secretKey) {
			throw new Error('HCAPTCHA_SECRET_KEY is required when CAPTCHA_ENABLED is true');
		}
		this.secretKey = Config.captcha.hcaptcha.secretKey;
	}

	async verify({token, remoteIp}: VerifyCaptchaParams): Promise<boolean> {
		try {
			const params = new URLSearchParams();
			params.append('secret', this.secretKey);
			params.append('response', token);
			if (remoteIp) {
				params.append('remoteip', remoteIp);
			}

			const response = await fetch(this.verifyUrl, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/x-www-form-urlencoded',
					'User-Agent': FLOODILKA_USER_AGENT,
				},
				body: params.toString(),
			});

			if (!response.ok) {
				Logger.error({status: response.status}, 'hCaptcha verify request failed');
				return false;
			}

			const data = (await response.json()) as HCaptchaVerifyResponse;

			if (!data.success) {
				Logger.warn({errorCodes: data['error-codes']}, 'hCaptcha verification failed');
				return false;
			}

			Logger.debug({hostname: data.hostname}, 'hCaptcha verification successful');
			return true;
		} catch (error) {
			Logger.error({error}, 'Error verifying hCaptcha token');
			return false;
		}
	}
}
