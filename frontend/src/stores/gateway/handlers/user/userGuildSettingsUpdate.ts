/*
 * SPDX-License-Identifier: AGPL-3.0-or-later
 * Copyright (C) 2020-2026 Fluxer Contributors
 * Copyright (C) 2026 Floodilka Contributors
 * Modified by Floodilka Contributors starting March 2026. See LICENSE and NOTICE.
 */

import GuildReadStateStore from '~/stores/GuildReadStateStore';
import UserGuildSettingsStore, {type GatewayGuildSettings} from '~/stores/UserGuildSettingsStore';
import type {GatewayHandlerContext} from '../index';

export function handleUserGuildSettingsUpdate(data: GatewayGuildSettings, _context: GatewayHandlerContext): void {
	UserGuildSettingsStore.handleUserGuildSettingsUpdate(data);
	GuildReadStateStore.handleUserGuildSettingsUpdate();
}
