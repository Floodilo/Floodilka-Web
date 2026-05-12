/*
 * SPDX-License-Identifier: AGPL-3.0-or-later
 * Copyright (C) 2020-2026 Fluxer Contributors
 * Copyright (C) 2026 Floodilka Contributors
 * Modified by Floodilka Contributors starting March 2026. See LICENSE and NOTICE.
 */

import type {GuildID, UserID} from '~/BrandedTypes';
import {AuditLogActionType} from '~/constants/AuditLogActionType';
import {
	CannotTransferOwnershipToBotError,
	MissingAccessError,
	MissingPermissionsError,
	UnknownGuildError,
	UnknownGuildMemberError,
} from '~/Errors';
import type {GuildResponse} from '~/guild/GuildModel';
import {mapGuildToGuildResponse} from '~/guild/GuildModel';
import type {IGuildRepository} from '~/guild/IGuildRepository';
import type {Guild, GuildMember, User} from '~/Models';
import type {IUserRepository} from '~/user/IUserRepository';
import {checkGuildVerificationWithGuildModel} from '~/utils/GuildVerificationUtils';
import type {GuildDataHelpers} from './GuildDataHelpers';

export class GuildOwnershipService {
	constructor(
		private readonly guildRepository: IGuildRepository,
		private readonly userRepository: IUserRepository,
		private readonly helpers: GuildDataHelpers,
	) {}

	async transferOwnership(
		params: {userId: UserID; guildId: GuildID; newOwnerId: UserID},
		auditLogReason?: string | null,
	): Promise<GuildResponse> {
		const {userId, guildId, newOwnerId} = params;
		const {guildData} = await this.helpers.getGuildAuthenticated({userId, guildId});

		if (guildData.owner_id !== userId.toString()) {
			throw new MissingPermissionsError();
		}

		const user = await this.userRepository.findUnique(userId);
		if (!user) throw new MissingAccessError();

		const newOwner = await this.guildRepository.getMember(guildId, newOwnerId);
		if (!newOwner) {
			throw new UnknownGuildMemberError();
		}

		const newOwnerUser = await this.userRepository.findUnique(newOwnerId);
		if (newOwnerUser?.isBot) {
			throw new CannotTransferOwnershipToBotError();
		}

		const guild = await this.guildRepository.findUnique(guildId);
		if (!guild) throw new UnknownGuildError();
		const previousSnapshot = this.helpers.serializeGuildForAudit(guild);

		const updatedGuild = await this.guildRepository.upsert({
			...guild.toRow(),
			owner_id: newOwnerId,
		});

		await this.helpers.dispatchGuildUpdate(updatedGuild);

		await this.helpers.recordAuditLog({
			guildId,
			userId,
			action: AuditLogActionType.GUILD_UPDATE,
			targetId: guildId,
			auditLogReason: auditLogReason ?? null,
			metadata: {new_owner_id: newOwnerId.toString()},
			changes: this.helpers.computeGuildChanges(previousSnapshot, updatedGuild),
		});
		return mapGuildToGuildResponse(updatedGuild);
	}

	async checkGuildVerification(params: {user: User; guild: Guild; member: GuildMember}): Promise<void> {
		const {user, guild, member} = params;
		checkGuildVerificationWithGuildModel({user, guild, member});
	}
}
