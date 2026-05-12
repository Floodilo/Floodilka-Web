/*
 * SPDX-License-Identifier: AGPL-3.0-or-later
 * Copyright (C) 2020-2026 Fluxer Contributors
 * Copyright (C) 2026 Floodilka Contributors
 * Modified by Floodilka Contributors starting March 2026. See LICENSE and NOTICE.
 */

import SavedMessagesStore from '~/stores/SavedMessagesStore';
import type {GatewayHandlerContext} from '../index';

interface SavedMessageDeletePayload {
	message_id: string;
}

export function handleSavedMessageDelete(data: SavedMessageDeletePayload, _context: GatewayHandlerContext): void {
	SavedMessagesStore.handleMessageDelete(data.message_id);
}
