/*
 * SPDX-License-Identifier: AGPL-3.0-or-later
 * Copyright (C) 2020-2026 Fluxer Contributors
 * Copyright (C) 2026 Floodilka Contributors
 * Modified by Floodilka Contributors starting March 2026. See LICENSE and NOTICE.
 */

import type {User} from '~/records/UserRecord';
import GuildVerificationStore from '~/stores/GuildVerificationStore';
import MessageStore from '~/stores/MessageStore';
import PermissionStore from '~/stores/PermissionStore';
import QuickSwitcherStore from '~/stores/QuickSwitcherStore';
import UserStore from '~/stores/UserStore';
import VoiceSettingsStore from '~/stores/VoiceSettingsStore';
import type {GatewayHandlerContext} from '../index';

interface UserUpdatePayload {
	id: string;
	username: string;
	avatar: string | null;
	flags: number;
}

export function handleUserUpdate(data: UserUpdatePayload, _context: GatewayHandlerContext): void {
	UserStore.handleUserUpdate(data as User);
	VoiceSettingsStore.handleUserUpdate(data);
	MessageStore.handleUserUpdate({user: {id: data.id}});
	PermissionStore.handleUserUpdate(data.id);
	QuickSwitcherStore.recomputeIfOpen();
	GuildVerificationStore.handleUserUpdate();
}
