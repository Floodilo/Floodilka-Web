/*
 * SPDX-License-Identifier: AGPL-3.0-or-later
 * Copyright (C) 2020-2026 Fluxer Contributors
 * Copyright (C) 2026 Floodilka Contributors
 * Modified by Floodilka Contributors starting March 2026. See LICENSE and NOTICE.
 */

import type {UserPartial} from '~/records/UserRecord';
import ChannelStore from '~/stores/ChannelStore';
import QuickSwitcherStore from '~/stores/QuickSwitcherStore';
import type {GatewayHandlerContext} from '../index';

interface ChannelRecipientPayload {
	channel_id: string;
	user: UserPartial;
}

export function handleChannelRecipientRemove(data: ChannelRecipientPayload, _context: GatewayHandlerContext): void {
	ChannelStore.handleChannelRecipientRemove({
		channelId: data.channel_id,
		user: data.user,
	});
	QuickSwitcherStore.recomputeIfOpen();
}
