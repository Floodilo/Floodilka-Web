/*
 * SPDX-License-Identifier: AGPL-3.0-or-later
 * Copyright (C) 2020-2026 Fluxer Contributors
 * Copyright (C) 2026 Floodilka Contributors
 * Modified by Floodilka Contributors starting March 2026. See LICENSE and NOTICE.
 */

import WebhookStore from '~/stores/WebhookStore';
import type {GatewayHandlerContext} from '../index';

interface WebhooksUpdatePayload {
	channel_id: string;
	guild_id: string;
}

export function handleWebhooksUpdate(data: WebhooksUpdatePayload, _context: GatewayHandlerContext): void {
	WebhookStore.handleWebhooksUpdate(data.guild_id, data.channel_id);
}
