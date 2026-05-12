/*
 * SPDX-License-Identifier: AGPL-3.0-or-later
 * Copyright (C) 2020-2026 Fluxer Contributors
 * Copyright (C) 2026 Floodilka Contributors
 * Modified by Floodilka Contributors starting March 2026. See LICENSE and NOTICE.
 */

import PresenceStore, {type Presence} from '~/stores/PresenceStore';
import type {GatewayHandlerContext} from '../index';

interface PresenceUpdateBulkPayload {
	presences: Array<Presence>;
	guild_id?: string;
}

export function handlePresenceUpdateBulk(data: PresenceUpdateBulkPayload, _context: GatewayHandlerContext): void {
	const guildId = data.guild_id;

	for (const presence of data.presences) {
		PresenceStore.handlePresenceUpdate({
			...presence,
			guild_id: guildId,
		});
	}
}
