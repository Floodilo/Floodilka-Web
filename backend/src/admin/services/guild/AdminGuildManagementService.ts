/*
 * SPDX-License-Identifier: AGPL-3.0-or-later
 * Copyright (C) 2020-2026 Fluxer Contributors
 * Copyright (C) 2026 Floodilka Contributors
 * Modified by Floodilka Contributors starting March 2026. See LICENSE and NOTICE.
 */

import {createGuildID, type GuildID, type UserID} from '~/BrandedTypes';
import {UnknownGuildError} from '~/Errors';
import type {IGuildRepository} from '~/guild/IGuildRepository';
import type {GuildService} from '~/guild/services/GuildService';
import type {IGatewayService} from '~/infrastructure/IGatewayService';
import type {AdminAuditService} from '../AdminAuditService';

interface AdminGuildManagementServiceDeps {
	guildRepository: IGuildRepository;
	gatewayService: IGatewayService;
	guildService: GuildService;
	auditService: AdminAuditService;
}

export class AdminGuildManagementService {
	constructor(private readonly deps: AdminGuildManagementServiceDeps) {}

	async reloadGuild(guildIdRaw: bigint, adminUserId: UserID, auditLogReason: string | null) {
		const {guildRepository, gatewayService, auditService} = this.deps;
		const guildId = createGuildID(guildIdRaw);
		const guild = await guildRepository.findUnique(guildId);
		if (!guild) {
			throw new UnknownGuildError();
		}

		await gatewayService.reloadGuild(guildId);

		await auditService.createAuditLog({
			adminUserId,
			targetType: 'guild',
			targetId: guildIdRaw,
			action: 'reload_guild',
			auditLogReason,
			metadata: new Map([['guild_id', guildIdRaw.toString()]]),
		});

		return {success: true};
	}

	async shutdownGuild(guildIdRaw: bigint, adminUserId: UserID, auditLogReason: string | null) {
		const {guildRepository, gatewayService, auditService} = this.deps;
		const guildId = createGuildID(guildIdRaw);
		const guild = await guildRepository.findUnique(guildId);
		if (!guild) {
			throw new UnknownGuildError();
		}

		await gatewayService.shutdownGuild(guildId);

		await auditService.createAuditLog({
			adminUserId,
			targetType: 'guild',
			targetId: guildIdRaw,
			action: 'shutdown_guild',
			auditLogReason,
			metadata: new Map([['guild_id', guildIdRaw.toString()]]),
		});

		return {success: true};
	}

	async deleteGuild(guildIdRaw: bigint, adminUserId: UserID, auditLogReason: string | null) {
		const {guildService, auditService} = this.deps;
		const guildId = createGuildID(guildIdRaw);

		await guildService.deleteGuildAsAdmin(guildId, auditLogReason);

		await auditService.createAuditLog({
			adminUserId,
			targetType: 'guild',
			targetId: guildIdRaw,
			action: 'delete_guild',
			auditLogReason,
			metadata: new Map([['guild_id', guildIdRaw.toString()]]),
		});

		return {success: true};
	}

	async getGuildMemoryStats(limit: number) {
		const {gatewayService} = this.deps;
		return await gatewayService.getGuildMemoryStats(limit);
	}

	async reloadAllGuilds(guildIds: Array<GuildID>) {
		const {gatewayService} = this.deps;
		return await gatewayService.reloadAllGuilds(guildIds);
	}

	async getNodeStats() {
		const {gatewayService} = this.deps;
		return await gatewayService.getNodeStats();
	}
}
