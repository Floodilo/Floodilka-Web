/*
 * SPDX-License-Identifier: AGPL-3.0-or-later
 * Copyright (C) 2020-2026 Fluxer Contributors
 * Copyright (C) 2026 Floodilka Contributors
 * Modified by Floodilka Contributors starting March 2026. See LICENSE and NOTICE.
 */

import TypingStore from '~/stores/TypingStore';
import type {GatewayHandlerContext} from '../index';

interface TypingStartPayload {
	channel_id: string;
	user_id: string;
}

export function handleTypingStart(data: TypingStartPayload, _context: GatewayHandlerContext): void {
	TypingStore.startTyping(data.channel_id, data.user_id);
}
