/*
 * SPDX-License-Identifier: AGPL-3.0-or-later
 * Copyright (C) 2020-2026 Fluxer Contributors
 * Copyright (C) 2026 Floodilka Contributors
 * Modified by Floodilka Contributors starting March 2026. See LICENSE and NOTICE.
 */

import type {HonoApp} from '~/App';
import {createReportID} from '~/BrandedTypes';
import {AdminACLs} from '~/Constants';
import {requireAdminACL} from '~/middleware/AdminMiddleware';
import {RateLimitMiddleware} from '~/middleware/RateLimitMiddleware';
import {RateLimitConfigs} from '~/RateLimitConfig';
import {createStringType, Int64Type, z} from '~/Schema';
import {Validator} from '~/Validator';
import {SearchReportsRequest} from '../AdminModel';

export const ReportAdminController = (app: HonoApp) => {
	app.post(
		'/admin/reports/list',
		RateLimitMiddleware(RateLimitConfigs.ADMIN_LOOKUP),
		requireAdminACL(AdminACLs.REPORT_VIEW),
		Validator(
			'json',
			z.object({
				status: z.number().optional(),
				limit: z.number().optional(),
				offset: z.number().optional(),
			}),
		),
		async (ctx) => {
			const adminService = ctx.get('adminService');
			const {status, limit, offset} = ctx.req.valid('json');
			return ctx.json(await adminService.listReports(status ?? 0, limit, offset));
		},
	);

	app.get(
		'/admin/reports/:report_id',
		RateLimitMiddleware(RateLimitConfigs.ADMIN_LOOKUP),
		requireAdminACL(AdminACLs.REPORT_VIEW),
		Validator('param', z.object({report_id: Int64Type})),
		async (ctx) => {
			const adminService = ctx.get('adminService');
			const {report_id} = ctx.req.valid('param');
			const report = await adminService.getReport(createReportID(report_id));
			return ctx.json(report);
		},
	);

	app.post(
		'/admin/reports/resolve',
		RateLimitMiddleware(RateLimitConfigs.ADMIN_LOOKUP),
		requireAdminACL(AdminACLs.REPORT_RESOLVE),
		Validator(
			'json',
			z.object({
				report_id: Int64Type,
				public_comment: createStringType(0, 512).optional(),
			}),
		),
		async (ctx) => {
			const adminService = ctx.get('adminService');
			const adminUserId = ctx.get('adminUserId');
			const auditLogReason = ctx.get('auditLogReason');
			const {report_id, public_comment} = ctx.req.valid('json');
			return ctx.json(
				await adminService.resolveReport(
					createReportID(report_id),
					adminUserId,
					public_comment || null,
					auditLogReason,
				),
			);
		},
	);

	app.post(
		'/admin/reports/search',
		RateLimitMiddleware(RateLimitConfigs.ADMIN_LOOKUP),
		requireAdminACL(AdminACLs.REPORT_VIEW),
		Validator('json', SearchReportsRequest),
		async (ctx) => {
			const adminService = ctx.get('adminService');
			const body = ctx.req.valid('json');
			return ctx.json(await adminService.searchReports(body));
		},
	);
};
