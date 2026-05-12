/*
 * SPDX-License-Identifier: AGPL-3.0-or-later
 * Copyright (C) 2020-2026 Fluxer Contributors
 * Copyright (C) 2026 Floodilka Contributors
 * Modified by Floodilka Contributors starting March 2026. See LICENSE and NOTICE.
 */

import type {Message} from '~/records/MessageRecord';
import SavedMessagesStore from '~/stores/SavedMessagesStore';
import type {GatewayHandlerContext} from '../index';

export function handleSavedMessageCreate(data: Message, _context: GatewayHandlerContext): void {
	SavedMessagesStore.handleMessageCreate(data);
}
