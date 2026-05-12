/*
 * SPDX-License-Identifier: AGPL-3.0-or-later
 * Copyright (C) 2020-2026 Fluxer Contributors
 * Copyright (C) 2026 Floodilka Contributors
 * Modified by Floodilka Contributors starting March 2026. See LICENSE and NOTICE.
 */

import React from 'react';
import type {GuildRecord} from '~/records/GuildRecord';
import UserStore from '~/stores/UserStore';
import * as PermissionUtils from '~/utils/PermissionUtils';

export function useRoleHierarchy(guild: GuildRecord | null | undefined) {
	const currentUser = UserStore.currentUser;

	const currentUserHighestRole = React.useMemo(() => {
		if (!guild || !currentUser) return null;
		return PermissionUtils.getHighestRole(guild.toJSON(), currentUser.id);
	}, [guild, currentUser]);

	const canManageRole = React.useCallback(
		(role: {id: string; position: number; permissions: bigint}): boolean => {
			if (!guild || !currentUser) return false;

			if (guild.isOwner(currentUser.id)) return true;

			if (!currentUserHighestRole) return false;

			return PermissionUtils.isRoleHigher(guild.toJSON(), currentUser.id, currentUserHighestRole, role);
		},
		[guild, currentUser, currentUserHighestRole],
	);

	const canManageTarget = React.useCallback(
		(targetUserId: string): boolean => {
			if (!guild || !currentUser) return false;

			if (guild.isOwner(currentUser.id)) return true;

			if (guild.isOwner(targetUserId)) return false;

			const targetHighestRole = PermissionUtils.getHighestRole(guild.toJSON(), targetUserId);

			if (!currentUserHighestRole) return false;
			if (!targetHighestRole) return true;

			return currentUserHighestRole.position > targetHighestRole.position;
		},
		[guild, currentUser, currentUserHighestRole],
	);

	return {canManageRole, canManageTarget, currentUserHighestRole};
}
