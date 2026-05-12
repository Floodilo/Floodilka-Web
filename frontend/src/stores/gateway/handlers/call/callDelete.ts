/*
 * SPDX-License-Identifier: AGPL-3.0-or-later
 * Copyright (C) 2020-2026 Fluxer Contributors
 * Copyright (C) 2026 Floodilka Contributors
 * Modified by Floodilka Contributors starting March 2026. See LICENSE and NOTICE.
 */

import CallStateStore from '~/stores/CallStateStore';
import SoundStore from '~/stores/SoundStore';
import MediaEngineStore from '~/stores/voice/MediaEngineFacade';
import type {GatewayHandlerContext} from '../index';

interface CallDeletePayload {
	channel_id: string;
}

export function handleCallDelete(data: CallDeletePayload, _context: GatewayHandlerContext): void {
	CallStateStore.handleCallDelete({channelId: data.channel_id});
	SoundStore.stopIncomingRing();

	// If we're connected to this channel's voice, disconnect
	if (MediaEngineStore.channelId === data.channel_id) {
		void MediaEngineStore.disconnectFromVoiceChannel('server');
	}
}
