/*
 * SPDX-License-Identifier: AGPL-3.0-or-later
 * Copyright (C) 2020-2026 Fluxer Contributors
 * Copyright (C) 2026 Floodilka Contributors
 * Modified by Floodilka Contributors starting March 2026. See LICENSE and NOTICE.
 */

import type {GuildID, RoleID, UserID} from '~/BrandedTypes';
import {MissingAccessError, MissingPermissionsError} from '~/Errors';
import type {GuildResponse} from '~/guild/GuildModel';
import type {IGatewayService} from '~/infrastructure/IGatewayService';

interface GuildAuth {
	guildData: GuildResponse;
	checkPermission: (permission: bigint) => Promise<void>;
	checkTargetMember: (targetUserId: UserID) => Promise<void>;
	getMyPermissions: () => Promise<bigint>;
	hasPermission: (permission: bigint) => Promise<boolean>;
	canManageRoles: (targetUserId: UserID, targetRoleId: RoleID) => Promise<boolean>;
}

export class GuildMemberAuthService {
	constructor(private readonly gatewayService: IGatewayService) {}

	async getGuildAuthenticated({userId, guildId}: {userId: UserID; guildId: GuildID}): Promise<GuildAuth> {
		const guildData = await this.gatewayService.getGuildData({guildId, userId});
		if (!guildData) throw new MissingAccessError();

		const checkPermission = async (permission: bigint) => {
			const hasPermission = await this.gatewayService.checkPermission({guildId, userId, permission});
			if (!hasPermission) throw new MissingPermissionsError();
		};

		const checkTargetMember = async (targetUserId: UserID) => {
			const canManage = await this.gatewayService.checkTargetMember({guildId, userId, targetUserId});
			if (!canManage) throw new MissingPermissionsError();
		};

		const getMyPermissions = async () => this.gatewayService.getUserPermissions({guildId, userId});
		const hasPermission = async (permission: bigint) =>
			this.gatewayService.checkPermission({guildId, userId, permission});
		const canManageRoles = async (targetUserId: UserID, targetRoleId: RoleID) =>
			this.gatewayService.canManageRoles({guildId, userId, targetUserId, roleId: targetRoleId});

		return {
			guildData,
			checkPermission,
			checkTargetMember,
			getMyPermissions,
			hasPermission,
			canManageRoles,
		};
	}
}
