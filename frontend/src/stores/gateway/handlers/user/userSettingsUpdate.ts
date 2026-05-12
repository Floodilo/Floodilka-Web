/*
 * SPDX-License-Identifier: AGPL-3.0-or-later
 * Copyright (C) 2020-2026 Fluxer Contributors
 * Copyright (C) 2026 Floodilka Contributors
 * Modified by Floodilka Contributors starting March 2026. See LICENSE and NOTICE.
 */

import GuildListStore from '~/stores/GuildListStore';
import UserSettingsStore from '~/stores/UserSettingsStore';
import type {GatewayHandlerContext} from '../index';

interface UserSettingsPayload {
	flags: number;
	status: string;
	theme: string;
	time_format: number;
	guild_positions: Array<string>;
	locale: string;
}

export function handleUserSettingsUpdate(data: UserSettingsPayload, _context: GatewayHandlerContext): void {
	UserSettingsStore.updateUserSettings(data);
	GuildListStore.sortGuilds();
}
