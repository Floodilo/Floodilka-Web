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

interface TurnstileVerifyResponse {
	success: boolean;
	challenge_ts?: string;
	hostname?: string;
	'error-codes'?: Array<string>;
	action?: string;
	cdata?: string;
}

export class TurnstileService implements ICaptchaService {
	private readonly secretKey: string;
	private readonly verifyUrl = 'https://challenges.cloudflare.com/turnstile/v0/siteverify';

	constructor() {
		if (!Config.captcha.turnstile?.secretKey) {
			throw new Error('TURNSTILE_SECRET_KEY is required when using Turnstile captcha');
		}
		this.secretKey = Config.captcha.turnstile.secretKey;
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
				Logger.error({status: response.status}, 'Turnstile verify request failed');
				return false;
			}

			const data = (await response.json()) as TurnstileVerifyResponse;

			if (!data.success) {
				Logger.warn({errorCodes: data['error-codes']}, 'Turnstile verification failed');
				return false;
			}

			Logger.debug({hostname: data.hostname}, 'Turnstile verification successful');
			return true;
		} catch (error) {
			Logger.error({error}, 'Error verifying Turnstile token');
			return false;
		}
	}
}
