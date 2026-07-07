/*
 * SPDX-License-Identifier: AGPL-3.0-or-later
 * Copyright (C) 2020-2026 Fluxer Contributors
 * Copyright (C) 2026 Floodilka Contributors
 * Modified by Floodilka Contributors starting March 2026. See LICENSE and NOTICE.
 */

import type {Hono} from 'hono';
import type {HonoEnv} from '~/App';
import {Config} from '~/Config';
import {API_CODE_VERSION} from '~/Constants';
import {RateLimitMiddleware} from '~/middleware/RateLimitMiddleware';
import {RateLimitConfigs} from '~/RateLimitConfig';

export function InstanceController(app: Hono<HonoEnv>) {
	app.get('/instance', RateLimitMiddleware(RateLimitConfigs.INSTANCE_INFO), async (ctx) => {
		ctx.header('Access-Control-Allow-Origin', '*');

		const apiClientEndpoint = Config.endpoints.apiClient;
		const apiPublicEndpoint = Config.endpoints.apiPublic;

		const response: Record<string, unknown> = {
			api_code_version: API_CODE_VERSION,
			endpoints: {
				api: apiClientEndpoint,
				api_client: apiClientEndpoint,
				api_public: apiPublicEndpoint,
				gateway: Config.endpoints.gateway,
				media: Config.endpoints.media,
				cdn: Config.endpoints.cdn,
				marketing: Config.endpoints.marketing,
				admin: Config.endpoints.admin,
				invite: Config.endpoints.invite,
				gift: Config.endpoints.gift,
				webapp: Config.endpoints.webApp,
			},
			captcha: {
				provider: Config.captcha.provider,
				hcaptcha_site_key: Config.captcha.hcaptcha?.siteKey ?? null,
				turnstile_site_key: Config.captcha.turnstile?.siteKey ?? null,
			},
			features: {
				sms_mfa_enabled: Config.sms.enabled,
				voice_enabled: Config.voice.enabled,
				payments_enabled: Config.cloudpayments.enabled,
				self_hosted: Config.instance.selfHosted,
				phone_enforcement_mode: Config.phoneEnforcement.mode,
			},
			push: {
				public_vapid_key: Config.push.publicVapidKey ?? null,
			},
		};

		return ctx.json(response);
	});
}
