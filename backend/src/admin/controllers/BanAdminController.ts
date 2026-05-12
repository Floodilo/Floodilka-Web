/*
 * SPDX-License-Identifier: AGPL-3.0-or-later
 * Copyright (C) 2020-2026 Fluxer Contributors
 * Copyright (C) 2026 Floodilka Contributors
 * Modified by Floodilka Contributors starting March 2026. See LICENSE and NOTICE.
 */

import type {HonoApp} from '~/App';
import {AdminACLs} from '~/Constants';
import {requireAdminACL} from '~/middleware/AdminMiddleware';
import {RateLimitMiddleware} from '~/middleware/RateLimitMiddleware';
import {RateLimitConfigs} from '~/RateLimitConfig';
import {Validator} from '~/Validator';
import {BanEmailRequest, BanIpRequest, BanPhoneRequest} from '../AdminModel';

export const BanAdminController = (app: HonoApp) => {
	app.post(
		'/admin/bans/ip/add',
		RateLimitMiddleware(RateLimitConfigs.ADMIN_BAN_OPERATION),
		requireAdminACL(AdminACLs.BAN_IP_ADD),
		Validator('json', BanIpRequest),
		async (ctx) => {
			const adminService = ctx.get('adminService');
			const adminUserId = ctx.get('adminUserId');
			const auditLogReason = ctx.get('auditLogReason');
			return ctx.json(await adminService.banIp(ctx.req.valid('json'), adminUserId, auditLogReason));
		},
	);

	app.post(
		'/admin/bans/ip/remove',
		RateLimitMiddleware(RateLimitConfigs.ADMIN_BAN_OPERATION),
		requireAdminACL(AdminACLs.BAN_IP_REMOVE),
		Validator('json', BanIpRequest),
		async (ctx) => {
			const adminService = ctx.get('adminService');
			const adminUserId = ctx.get('adminUserId');
			const auditLogReason = ctx.get('auditLogReason');
			return ctx.json(await adminService.unbanIp(ctx.req.valid('json'), adminUserId, auditLogReason));
		},
	);

	app.post(
		'/admin/bans/ip/check',
		RateLimitMiddleware(RateLimitConfigs.ADMIN_BAN_OPERATION),
		requireAdminACL(AdminACLs.BAN_IP_CHECK),
		Validator('json', BanIpRequest),
		async (ctx) => {
			const adminService = ctx.get('adminService');
			return ctx.json(await adminService.checkIpBan(ctx.req.valid('json')));
		},
	);

	app.post(
		'/admin/bans/email/add',
		RateLimitMiddleware(RateLimitConfigs.ADMIN_BAN_OPERATION),
		requireAdminACL(AdminACLs.BAN_EMAIL_ADD),
		Validator('json', BanEmailRequest),
		async (ctx) => {
			const adminService = ctx.get('adminService');
			const adminUserId = ctx.get('adminUserId');
			const auditLogReason = ctx.get('auditLogReason');
			return ctx.json(await adminService.banEmail(ctx.req.valid('json'), adminUserId, auditLogReason));
		},
	);

	app.post(
		'/admin/bans/email/remove',
		RateLimitMiddleware(RateLimitConfigs.ADMIN_BAN_OPERATION),
		requireAdminACL(AdminACLs.BAN_EMAIL_REMOVE),
		Validator('json', BanEmailRequest),
		async (ctx) => {
			const adminService = ctx.get('adminService');
			const adminUserId = ctx.get('adminUserId');
			const auditLogReason = ctx.get('auditLogReason');
			return ctx.json(await adminService.unbanEmail(ctx.req.valid('json'), adminUserId, auditLogReason));
		},
	);

	app.post(
		'/admin/bans/email/check',
		RateLimitMiddleware(RateLimitConfigs.ADMIN_BAN_OPERATION),
		requireAdminACL(AdminACLs.BAN_EMAIL_CHECK),
		Validator('json', BanEmailRequest),
		async (ctx) => {
			const adminService = ctx.get('adminService');
			return ctx.json(await adminService.checkEmailBan(ctx.req.valid('json')));
		},
	);

	app.post(
		'/admin/bans/phone/add',
		RateLimitMiddleware(RateLimitConfigs.ADMIN_BAN_OPERATION),
		requireAdminACL(AdminACLs.BAN_PHONE_ADD),
		Validator('json', BanPhoneRequest),
		async (ctx) => {
			const adminService = ctx.get('adminService');
			const adminUserId = ctx.get('adminUserId');
			const auditLogReason = ctx.get('auditLogReason');
			return ctx.json(await adminService.banPhone(ctx.req.valid('json'), adminUserId, auditLogReason));
		},
	);

	app.post(
		'/admin/bans/phone/remove',
		RateLimitMiddleware(RateLimitConfigs.ADMIN_BAN_OPERATION),
		requireAdminACL(AdminACLs.BAN_PHONE_REMOVE),
		Validator('json', BanPhoneRequest),
		async (ctx) => {
			const adminService = ctx.get('adminService');
			const adminUserId = ctx.get('adminUserId');
			const auditLogReason = ctx.get('auditLogReason');
			return ctx.json(await adminService.unbanPhone(ctx.req.valid('json'), adminUserId, auditLogReason));
		},
	);

	app.post(
		'/admin/bans/phone/check',
		RateLimitMiddleware(RateLimitConfigs.ADMIN_BAN_OPERATION),
		requireAdminACL(AdminACLs.BAN_PHONE_CHECK),
		Validator('json', BanPhoneRequest),
		async (ctx) => {
			const adminService = ctx.get('adminService');
			return ctx.json(await adminService.checkPhoneBan(ctx.req.valid('json')));
		},
	);
};
