/*
 * SPDX-License-Identifier: AGPL-3.0-or-later
 * Copyright (C) 2020-2026 Fluxer Contributors
 * Copyright (C) 2026 Floodilka Contributors
 * Modified by Floodilka Contributors starting March 2026. See LICENSE and NOTICE.
 */

import type {Channel} from '~/records/ChannelRecord';
import ChannelStore from '~/stores/ChannelStore';
import GuildReadStateStore from '~/stores/GuildReadStateStore';
import PermissionStore from '~/stores/PermissionStore';
import QuickSwitcherStore from '~/stores/QuickSwitcherStore';
import ReadStateStore from '~/stores/ReadStateStore';
import type {GatewayHandlerContext} from '../index';

interface ChannelPayload {
	id: string;
	type: number;
}

export function handleChannelCreate(data: ChannelPayload, _context: GatewayHandlerContext): void {
	const channel = data as Channel;

	ChannelStore.handleChannelCreate({channel});
	PermissionStore.handleChannelUpdate(data.id);
	ReadStateStore.handleChannelCreate({channel});
	GuildReadStateStore.handleGenericUpdate(data.id);
	QuickSwitcherStore.recomputeIfOpen();
}
