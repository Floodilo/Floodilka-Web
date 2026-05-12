/*
 * SPDX-License-Identifier: AGPL-3.0-or-later
 * Copyright (C) 2020-2026 Fluxer Contributors
 * Copyright (C) 2026 Floodilka Contributors
 * Modified by Floodilka Contributors starting March 2026. See LICENSE and NOTICE.
 */

import type {ChannelID, EmojiID, GuildID, RoleID, StickerID, UserID} from '~/BrandedTypes';
import type {AuditLogActionType} from '~/constants/AuditLogActionType';
import {UnknownGuildError} from '~/Errors';
import type {GuildAuditLogChange, GuildAuditLogService} from '~/guild/GuildAuditLogService';
import type {GuildResponse} from '~/guild/GuildModel';
import {mapGuildToGuildResponse} from '~/guild/GuildModel';
import type {IGatewayService} from '~/infrastructure/IGatewayService';
import {Logger} from '~/Logger';
import type {Guild} from '~/Models';
import {serializeGuildForAudit as serializeGuildForAuditUtil} from '~/utils/AuditSerializationUtils';
import {requirePermission} from '~/utils/PermissionUtils';

interface GuildAuth {
	guildData: GuildResponse;
	checkPermission: (permission: bigint) => Promise<void>;
}

export class GuildDataHelpers {
	constructor(
		private readonly gatewayService: IGatewayService,
		private readonly guildAuditLogService: GuildAuditLogService,
	) {}

	async getGuildAuthenticated(params: {userId: UserID; guildId: GuildID}): Promise<GuildAuth> {
		const {userId, guildId} = params;
		const guildData = await this.gatewayService.getGuildData({guildId, userId});
		if (!guildData) throw new UnknownGuildError();

		const checkPermission = async (permission: bigint) => {
			await requirePermission(this.gatewayService, {guildId, userId, permission});
		};

		return {
			guildData,
			checkPermission,
		};
	}

	serializeGuildForAudit(guild: Guild): Record<string, unknown> {
		return serializeGuildForAuditUtil(guild);
	}

	computeGuildChanges(
		previousSnapshot: Record<string, unknown> | null,
		guildOrSnapshot: Guild | Record<string, unknown> | null,
	): GuildAuditLogChange {
		const currentSnapshot = guildOrSnapshot
			? 'id' in guildOrSnapshot
				? this.serializeGuildForAudit(guildOrSnapshot as Guild)
				: guildOrSnapshot
			: null;
		return this.guildAuditLogService.computeChanges(previousSnapshot, currentSnapshot);
	}

	async dispatchGuildUpdate(guild: Guild): Promise<void> {
		await this.gatewayService.dispatchGuild({
			guildId: guild.id,
			event: 'GUILD_UPDATE',
			data: mapGuildToGuildResponse(guild),
		});
	}

	async recordAuditLog(params: {
		guildId: GuildID;
		userId: UserID;
		action: AuditLogActionType;
		targetId?: GuildID | ChannelID | RoleID | UserID | EmojiID | StickerID | string | null;
		auditLogReason?: string | null;
		metadata?: Map<string, string> | Record<string, string>;
		changes?: GuildAuditLogChange | null;
		createdAt?: Date;
	}): Promise<void> {
		const targetId =
			params.targetId === undefined || params.targetId === null
				? null
				: typeof params.targetId === 'string'
					? params.targetId
					: params.targetId.toString();

		try {
			const builder = this.guildAuditLogService
				.createBuilder(params.guildId, params.userId)
				.withAction(params.action, targetId)
				.withReason(params.auditLogReason ?? null);

			if (params.metadata) {
				builder.withMetadata(params.metadata);
			}
			if (params.changes) {
				builder.withChanges(params.changes);
			}
			if (params.createdAt) {
				builder.withCreatedAt(params.createdAt);
			}

			await builder.commit();
		} catch (error) {
			Logger.error(
				{
					error,
					guildId: params.guildId.toString(),
					userId: params.userId.toString(),
					action: params.action,
					targetId,
				},
				'Failed to record guild audit log',
			);
		}
	}
}
