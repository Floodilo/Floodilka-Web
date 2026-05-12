/*
 * SPDX-License-Identifier: AGPL-3.0-or-later
 * Copyright (C) 2020-2026 Fluxer Contributors
 * Copyright (C) 2026 Floodilka Contributors
 * Modified by Floodilka Contributors starting March 2026. See LICENSE and NOTICE.
 */

import type {HonoApp} from '~/App';
import {AdminACLs} from '~/Constants';
import {InstanceConfigRepository} from '~/instance/InstanceConfigRepository';
import {requireAdminACL} from '~/middleware/AdminMiddleware';
import {RateLimitMiddleware} from '~/middleware/RateLimitMiddleware';
import {RateLimitConfigs} from '~/RateLimitConfig';
import {z} from '~/Schema';
import {Validator} from '~/Validator';

const instanceConfigRepository = new InstanceConfigRepository();

export const InstanceConfigAdminController = (app: HonoApp) => {
	app.post(
		'/admin/instance-config/get',
		RateLimitMiddleware(RateLimitConfigs.ADMIN_LOOKUP),
		requireAdminACL(AdminACLs.INSTANCE_CONFIG_VIEW),
		async (ctx) => {
			const config = await instanceConfigRepository.getInstanceConfig();

			return ctx.json({
				registration_alerts_webhook_url: config.registrationAlertsWebhookUrl,
				system_alerts_webhook_url: config.systemAlertsWebhookUrl,
			});
		},
	);

	app.post(
		'/admin/instance-config/update',
		RateLimitMiddleware(RateLimitConfigs.ADMIN_USER_MODIFY),
		requireAdminACL(AdminACLs.INSTANCE_CONFIG_UPDATE),
		Validator(
			'json',
			z.object({
				registration_alerts_webhook_url: z.string().url().nullable().optional(),
				system_alerts_webhook_url: z.string().url().nullable().optional(),
			}),
		),
		async (ctx) => {
			const data = ctx.req.valid('json');

			if (data.registration_alerts_webhook_url !== undefined) {
				await instanceConfigRepository.setRegistrationAlertsWebhookUrl(data.registration_alerts_webhook_url);
			}

			if (data.system_alerts_webhook_url !== undefined) {
				await instanceConfigRepository.setSystemAlertsWebhookUrl(data.system_alerts_webhook_url);
			}

			const updatedConfig = await instanceConfigRepository.getInstanceConfig();

			return ctx.json({
				registration_alerts_webhook_url: updatedConfig.registrationAlertsWebhookUrl,
				system_alerts_webhook_url: updatedConfig.systemAlertsWebhookUrl,
			});
		},
	);
};
