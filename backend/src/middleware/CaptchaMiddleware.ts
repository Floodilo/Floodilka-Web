/*
 * SPDX-License-Identifier: AGPL-3.0-or-later
 * Copyright (C) 2020-2026 Fluxer Contributors
 * Copyright (C) 2026 Floodilka Contributors
 * Modified by Floodilka Contributors starting March 2026. See LICENSE and NOTICE.
 */

import {createMiddleware} from 'hono/factory';
import type {HonoEnv} from '~/App';
import {Config} from '~/Config';
import {CaptchaVerificationRequiredError, InvalidCaptchaError} from '~/Errors';
import {CaptchaService} from '~/infrastructure/CaptchaService';
import type {ICaptchaService} from '~/infrastructure/ICaptchaService';
import {TestCaptchaService} from '~/infrastructure/TestCaptchaService';
import {TurnstileService} from '~/infrastructure/TurnstileService';
import {extractClientIp} from '~/utils/IpUtils';

const useTestCaptcha = Config.dev.testModeEnabled;
const testCaptchaService = new TestCaptchaService();
let hcaptchaService: ICaptchaService | null = null;
let turnstileService: ICaptchaService | null = null;

if (!useTestCaptcha && Config.captcha.enabled) {
	if (Config.captcha.hcaptcha?.secretKey) {
		hcaptchaService = new CaptchaService();
	}
	if (Config.captcha.turnstile?.secretKey) {
		turnstileService = new TurnstileService();
	}
	if (!hcaptchaService && !turnstileService) {
		throw new Error(
			'CAPTCHA_ENABLED=true but no captcha service has been configured. ' +
				'Please supply HCAPTCHA_SECRET_KEY or TURNSTILE_SECRET_KEY (or disable captcha).',
		);
	}
}

export const CaptchaMiddleware = createMiddleware<HonoEnv>(async (ctx, next) => {
	if (!Config.captcha.enabled) {
		await next();
		return;
	}

	const token = ctx.req.header('x-captcha-token');
	const captchaType = ctx.req.header('x-captcha-type');

	if (!token) {
		throw new CaptchaVerificationRequiredError();
	}

	let captchaService: ICaptchaService;
	if (useTestCaptcha) {
		captchaService = testCaptchaService;
	} else if (captchaType === 'turnstile' && turnstileService) {
		captchaService = turnstileService;
	} else if (captchaType === 'hcaptcha' && hcaptchaService) {
		captchaService = hcaptchaService;
	} else {
		if (Config.captcha.provider === 'turnstile' && turnstileService) {
			captchaService = turnstileService;
		} else if (Config.captcha.provider === 'hcaptcha' && hcaptchaService) {
			captchaService = hcaptchaService;
		} else {
			const fallbackService = turnstileService || hcaptchaService;
			if (!fallbackService) {
				throw new Error(
					`Captcha service not available (provider=${Config.captcha.provider}, ` +
						`turnstile=${Boolean(turnstileService)}, hcaptcha=${Boolean(hcaptchaService)})`,
				);
			}
			captchaService = fallbackService;
		}
	}

	const isValid = await captchaService.verify({
		token,
		remoteIp: extractClientIp(ctx.req.raw) ?? undefined,
	});

	if (!isValid) {
		throw new InvalidCaptchaError();
	}

	await next();
});
