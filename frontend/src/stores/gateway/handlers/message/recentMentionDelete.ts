/*
 * SPDX-License-Identifier: AGPL-3.0-or-later
 * Copyright (C) 2020-2026 Fluxer Contributors
 * Copyright (C) 2026 Floodilka Contributors
 * Modified by Floodilka Contributors starting March 2026. See LICENSE and NOTICE.
 */

import RecentMentionsStore from '~/stores/RecentMentionsStore';
import type {GatewayHandlerContext} from '../index';

interface RecentMentionDeletePayload {
	message_id: string;
}

export function handleRecentMentionDelete(data: RecentMentionDeletePayload, _context: GatewayHandlerContext): void {
	RecentMentionsStore.handleMessageDelete(data.message_id);
}
