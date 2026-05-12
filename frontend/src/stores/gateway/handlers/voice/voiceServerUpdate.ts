/*
 * SPDX-License-Identifier: AGPL-3.0-or-later
 * Copyright (C) 2020-2026 Fluxer Contributors
 * Copyright (C) 2026 Floodilka Contributors
 * Modified by Floodilka Contributors starting March 2026. See LICENSE and NOTICE.
 */

import MediaEngineStore from '~/stores/voice/MediaEngineFacade';
import type {GatewayHandlerContext} from '../index';

interface VoiceServerUpdatePayload {
	token: string;
	endpoint: string;
	connection_id: string;
	guild_id?: string;
	channel_id?: string;
}

export function handleVoiceServerUpdate(data: VoiceServerUpdatePayload, _context: GatewayHandlerContext): void {
	MediaEngineStore.handleVoiceServerUpdate({
		token: data.token,
		endpoint: data.endpoint,
		connection_id: data.connection_id,
		guild_id: data.guild_id,
		channel_id: data.channel_id,
	});
}
