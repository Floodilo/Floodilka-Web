/*
 * SPDX-License-Identifier: AGPL-3.0-or-later
 * Copyright (C) 2020-2026 Fluxer Contributors
 * Copyright (C) 2026 Floodilka Contributors
 * Modified by Floodilka Contributors starting March 2026. See LICENSE and NOTICE.
 */

import z from 'zod';
import type {HonoApp} from '~/App';
import {createGuildID} from '~/BrandedTypes';
import {AdminACLs} from '~/Constants';
import {requireAdminACL} from '~/middleware/AdminMiddleware';
import {RateLimitMiddleware} from '~/middleware/RateLimitMiddleware';
import {RateLimitConfigs} from '~/RateLimitConfig';
import {AdminRateLimitConfigs} from '~/rate_limit_configs/AdminRateLimitConfig';
import {Int64Type} from '~/Schema';
import {Validator} from '~/Validator';
import {
	ClearGuildFieldsRequest,
	DeleteGuildRequest,
	ForceAddUserToGuildRequest,
	ListGuildMembersRequest,
	LookupGuildRequest,
	ReloadGuildRequest,
	ShutdownGuildRequest,
	TransferGuildOwnershipRequest,
	UpdateGuildFeaturesRequest,
	UpdateGuildNameRequest,
	UpdateGuildSettingsRequest,
	UpdateGuildVanityRequest,
} from '../AdminModel';

export const GuildAdminController = (app: HonoApp) => {
	app.post(
		'/admin/guilds/lookup',
		RateLimitMiddleware(RateLimitConfigs.ADMIN_LOOKUP),
		requireAdminACL(AdminACLs.GUILD_LOOKUP),
		Validator('json', LookupGuildRequest),
		async (ctx) => {
			const adminService = ctx.get('adminService');
			return ctx.json(await adminService.lookupGuild(ctx.req.valid('json')));
		},
	);

	app.post(
		'/admin/guilds/list-members',
		RateLimitMiddleware(RateLimitConfigs.ADMIN_LOOKUP),
		requireAdminACL(AdminACLs.GUILD_LIST_MEMBERS),
		Validator('json', ListGuildMembersRequest),
		async (ctx) => {
			const adminService = ctx.get('adminService');
			return ctx.json(await adminService.listGuildMembers(ctx.req.valid('json')));
		},
	);

	app.get(
		'/admin/guilds/:guild_id/emojis',
		RateLimitMiddleware(AdminRateLimitConfigs.ADMIN_LOOKUP),
		requireAdminACL(AdminACLs.ASSET_PURGE),
		Validator('param', z.object({guild_id: Int64Type})),
		async (ctx) => {
			const adminService = ctx.get('adminService');
			const guildId = createGuildID(ctx.req.valid('param').guild_id);
			return ctx.json(await adminService.listGuildEmojis(guildId));
		},
	);

	app.get(
		'/admin/guilds/:guild_id/stickers',
		RateLimitMiddleware(AdminRateLimitConfigs.ADMIN_LOOKUP),
		requireAdminACL(AdminACLs.ASSET_PURGE),
		Validator('param', z.object({guild_id: Int64Type})),
		async (ctx) => {
			const adminService = ctx.get('adminService');
			const guildId = createGuildID(ctx.req.valid('param').guild_id);
			return ctx.json(await adminService.listGuildStickers(guildId));
		},
	);

	app.post(
		'/admin/guilds/clear-fields',
		RateLimitMiddleware(RateLimitConfigs.ADMIN_GUILD_MODIFY),
		requireAdminACL(AdminACLs.GUILD_UPDATE_SETTINGS),
		Validator('json', ClearGuildFieldsRequest),
		async (ctx) => {
			const adminService = ctx.get('adminService');
			const adminUserId = ctx.get('adminUserId');
			const auditLogReason = ctx.get('auditLogReason');
			return ctx.json(await adminService.clearGuildFields(ctx.req.valid('json'), adminUserId, auditLogReason));
		},
	);

	app.post(
		'/admin/guilds/update-features',
		RateLimitMiddleware(RateLimitConfigs.ADMIN_GUILD_MODIFY),
		requireAdminACL(AdminACLs.GUILD_UPDATE_FEATURES),
		Validator('json', UpdateGuildFeaturesRequest),
		async (ctx) => {
			const adminService = ctx.get('adminService');
			const adminUserId = ctx.get('adminUserId');
			const auditLogReason = ctx.get('auditLogReason');
			const body = ctx.req.valid('json');
			const guildId = createGuildID(body.guild_id);
			return ctx.json(
				await adminService.updateGuildFeatures({
					guildId,
					addFeatures: body.add_features,
					removeFeatures: body.remove_features,
					adminUserId,
					auditLogReason,
				}),
			);
		},
	);

	app.post(
		'/admin/guilds/update-name',
		RateLimitMiddleware(RateLimitConfigs.ADMIN_GUILD_MODIFY),
		requireAdminACL(AdminACLs.GUILD_UPDATE_NAME),
		Validator('json', UpdateGuildNameRequest),
		async (ctx) => {
			const adminService = ctx.get('adminService');
			const adminUserId = ctx.get('adminUserId');
			const auditLogReason = ctx.get('auditLogReason');
			return ctx.json(await adminService.updateGuildName(ctx.req.valid('json'), adminUserId, auditLogReason));
		},
	);

	app.post(
		'/admin/guilds/update-settings',
		RateLimitMiddleware(RateLimitConfigs.ADMIN_GUILD_MODIFY),
		requireAdminACL(AdminACLs.GUILD_UPDATE_SETTINGS),
		Validator('json', UpdateGuildSettingsRequest),
		async (ctx) => {
			const adminService = ctx.get('adminService');
			const adminUserId = ctx.get('adminUserId');
			const auditLogReason = ctx.get('auditLogReason');
			return ctx.json(await adminService.updateGuildSettings(ctx.req.valid('json'), adminUserId, auditLogReason));
		},
	);

	app.post(
		'/admin/guilds/transfer-ownership',
		RateLimitMiddleware(RateLimitConfigs.ADMIN_GUILD_MODIFY),
		requireAdminACL(AdminACLs.GUILD_TRANSFER_OWNERSHIP),
		Validator('json', TransferGuildOwnershipRequest),
		async (ctx) => {
			const adminService = ctx.get('adminService');
			const adminUserId = ctx.get('adminUserId');
			const auditLogReason = ctx.get('auditLogReason');
			return ctx.json(await adminService.transferGuildOwnership(ctx.req.valid('json'), adminUserId, auditLogReason));
		},
	);

	app.post(
		'/admin/guilds/update-vanity',
		RateLimitMiddleware(RateLimitConfigs.ADMIN_GUILD_MODIFY),
		requireAdminACL(AdminACLs.GUILD_UPDATE_VANITY),
		Validator('json', UpdateGuildVanityRequest),
		async (ctx) => {
			const adminService = ctx.get('adminService');
			const adminUserId = ctx.get('adminUserId');
			const auditLogReason = ctx.get('auditLogReason');
			return ctx.json(await adminService.updateGuildVanity(ctx.req.valid('json'), adminUserId, auditLogReason));
		},
	);

	app.post(
		'/admin/guilds/force-add-user',
		RateLimitMiddleware(RateLimitConfigs.ADMIN_GUILD_MODIFY),
		requireAdminACL(AdminACLs.GUILD_FORCE_ADD_MEMBER),
		Validator('json', ForceAddUserToGuildRequest),
		async (ctx) => {
			const adminService = ctx.get('adminService');
			const adminUserId = ctx.get('adminUserId');
			const auditLogReason = ctx.get('auditLogReason');
			const requestCache = ctx.get('requestCache');
			return ctx.json(
				await adminService.forceAddUserToGuild({
					data: ctx.req.valid('json'),
					requestCache,
					adminUserId,
					auditLogReason,
				}),
			);
		},
	);

	app.post(
		'/admin/guilds/reload',
		RateLimitMiddleware(RateLimitConfigs.ADMIN_GUILD_MODIFY),
		requireAdminACL(AdminACLs.GUILD_RELOAD),
		Validator('json', ReloadGuildRequest),
		async (ctx) => {
			const adminService = ctx.get('adminService');
			const adminUserId = ctx.get('adminUserId');
			const auditLogReason = ctx.get('auditLogReason');
			const body = ctx.req.valid('json');
			return ctx.json(await adminService.reloadGuild(body.guild_id, adminUserId, auditLogReason));
		},
	);

	app.post(
		'/admin/guilds/shutdown',
		RateLimitMiddleware(RateLimitConfigs.ADMIN_GUILD_MODIFY),
		requireAdminACL(AdminACLs.GUILD_SHUTDOWN),
		Validator('json', ShutdownGuildRequest),
		async (ctx) => {
			const adminService = ctx.get('adminService');
			const adminUserId = ctx.get('adminUserId');
			const auditLogReason = ctx.get('auditLogReason');
			const body = ctx.req.valid('json');
			return ctx.json(await adminService.shutdownGuild(body.guild_id, adminUserId, auditLogReason));
		},
	);

	app.post(
		'/admin/guilds/delete',
		RateLimitMiddleware(RateLimitConfigs.ADMIN_GUILD_MODIFY),
		requireAdminACL(AdminACLs.GUILD_DELETE),
		Validator('json', DeleteGuildRequest),
		async (ctx) => {
			const adminService = ctx.get('adminService');
			const adminUserId = ctx.get('adminUserId');
			const auditLogReason = ctx.get('auditLogReason');
			const body = ctx.req.valid('json');
			return ctx.json(await adminService.deleteGuild(body.guild_id, adminUserId, auditLogReason));
		},
	);
};
