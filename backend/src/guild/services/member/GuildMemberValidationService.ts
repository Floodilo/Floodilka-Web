/*
 * SPDX-License-Identifier: AGPL-3.0-or-later
 * Copyright (C) 2020-2026 Fluxer Contributors
 * Copyright (C) 2026 Floodilka Contributors
 * Modified by Floodilka Contributors starting March 2026. See LICENSE and NOTICE.
 */

import type {GuildID, RoleID, UserID} from '~/BrandedTypes';
import {guildIdToRoleId} from '~/BrandedTypes';
import {Permissions} from '~/Constants';
import {BannedFromGuildError, IpBannedFromGuildError, MissingPermissionsError, UnknownGuildRoleError} from '~/Errors';
import type {GuildResponse} from '~/guild/GuildModel';
import type {GuildMember} from '~/Models';
import type {IUserRepository} from '~/user/IUserRepository';
import type {IGuildRepository} from '../../IGuildRepository';

export class GuildMemberValidationService {
	constructor(
		private readonly guildRepository: IGuildRepository,
		private readonly userRepository: IUserRepository,
	) {}

	async validateAndGetRoleIds(params: {
		userId: UserID;
		guildId: GuildID;
		guildData: GuildResponse;
		targetId: UserID;
		targetMember: GuildMember;
		newRoles: Array<RoleID>;
		hasPermission: (permission: bigint) => Promise<boolean>;
		canManageRoles: (targetUserId: UserID, targetRoleId: RoleID) => Promise<boolean>;
	}): Promise<Array<RoleID>> {
		const {userId, guildId, guildData, targetId, targetMember, newRoles, hasPermission, canManageRoles} = params;

		if (guildData && guildData.owner_id === userId.toString()) {
			const existingRoles = await this.guildRepository.listRolesByIds(newRoles, guildId);
			if (existingRoles.length !== newRoles.length) {
				throw new UnknownGuildRoleError();
			}
			return newRoles;
		}

		if (!(await hasPermission(Permissions.MANAGE_ROLES))) {
			throw new MissingPermissionsError();
		}

		const currentRoles = targetMember.roleIds;
		const rolesToRemove = [...currentRoles].filter((roleId) => !newRoles.includes(roleId));
		const rolesToAdd = newRoles.filter((roleId) => !currentRoles.has(roleId));

		for (const roleId of [...rolesToAdd, ...rolesToRemove]) {
			if (roleId === guildIdToRoleId(guildId)) continue;
			if (!(await canManageRoles(targetId, roleId))) {
				throw new MissingPermissionsError();
			}
		}

		const existingRoles = await this.guildRepository.listRolesByIds(newRoles, guildId);
		if (existingRoles.length !== newRoles.length) {
			throw new UnknownGuildRoleError();
		}

		return newRoles;
	}

	async validateRoleAssignment(params: {
		guildData: GuildResponse;
		guildId: GuildID;
		userId: UserID;
		targetId: UserID;
		roleId: RoleID;
		canManageRoles: (targetUserId: UserID, targetRoleId: RoleID) => Promise<boolean>;
	}): Promise<void> {
		const {guildData, guildId, userId, targetId, roleId, canManageRoles} = params;

		if (guildData && guildData.owner_id === userId.toString()) {
			const role = await this.guildRepository.getRole(roleId, guildId);
			if (!role || role.id === guildIdToRoleId(guildId)) {
				throw new UnknownGuildRoleError();
			}
		} else {
			if (!(await canManageRoles(targetId, roleId))) {
				throw new MissingPermissionsError();
			}
		}
	}

	async checkUserBanStatus({userId, guildId}: {userId: UserID; guildId: GuildID}): Promise<void> {
		const bans = await this.guildRepository.listBans(guildId);
		const user = await this.userRepository.findUnique(userId);
		const userIp = user?.lastActiveIp;

		for (const ban of bans) {
			if (ban.userId === userId) {
				throw new BannedFromGuildError();
			}
			if (userIp && ban.ipAddress && ban.ipAddress === userIp) {
				throw new IpBannedFromGuildError();
			}
		}
	}
}
