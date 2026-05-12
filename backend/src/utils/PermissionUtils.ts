/*
 * SPDX-License-Identifier: AGPL-3.0-or-later
 * Copyright (C) 2020-2026 Fluxer Contributors
 * Copyright (C) 2026 Floodilka Contributors
 * Modified by Floodilka Contributors starting March 2026. See LICENSE and NOTICE.
 */

import type {ChannelID, GuildID, UserID} from '~/BrandedTypes';
import {Permissions} from '~/Constants';
import {MissingPermissionsError} from '~/Errors';
import type {IGatewayService} from '~/infrastructure/IGatewayService';

interface PermissionsDiff {
	added: Array<string>;
	removed: Array<string>;
}

export function computePermissionsDiff(oldPermissions: bigint, newPermissions: bigint): PermissionsDiff {
	const added: Array<string> = [];
	const removed: Array<string> = [];

	for (const [name, value] of Object.entries(Permissions)) {
		const hadPermission = (oldPermissions & value) !== 0n;
		const hasPermission = (newPermissions & value) !== 0n;

		if (!hadPermission && hasPermission) {
			added.push(name);
		} else if (hadPermission && !hasPermission) {
			removed.push(name);
		}
	}

	return {added, removed};
}

export async function requirePermission(
	gatewayService: IGatewayService,
	params: {
		guildId: GuildID;
		userId: UserID;
		permission: bigint;
		channelId?: ChannelID;
	},
): Promise<void> {
	const result = await gatewayService.checkPermission(params);
	if (!result) {
		throw new MissingPermissionsError();
	}
}

export async function hasPermission(
	gatewayService: IGatewayService,
	params: {
		guildId: GuildID;
		userId: UserID;
		permission: bigint;
		channelId?: ChannelID;
	},
): Promise<boolean> {
	return gatewayService.checkPermission(params);
}
