/*
 * SPDX-License-Identifier: AGPL-3.0-or-later
 * Copyright (C) 2020-2026 Fluxer Contributors
 * Copyright (C) 2026 Floodilka Contributors
 * Modified by Floodilka Contributors starting March 2026. See LICENSE and NOTICE.
 */

import CallAvailabilityStore from '~/stores/CallAvailabilityStore';
import CallStateStore, {type GatewayCallData} from '~/stores/CallStateStore';
import DimensionStore from '~/stores/DimensionStore';
import type {GatewayHandlerContext} from '../index';

interface VoiceState {
	user_id: string;
	channel_id?: string;
	session_id?: string;
	self_mute?: boolean;
	self_deaf?: boolean;
	self_video?: boolean;
	self_stream?: boolean;
}

interface CallCreatePayload {
	channel_id: string;
	message_id?: string;
	region?: string;
	voice_states?: Array<VoiceState>;
	ringing?: Array<string>;
}

export function handleCallCreate(data: CallCreatePayload, _context: GatewayHandlerContext): void {
	const callData: GatewayCallData = {
		channel_id: data.channel_id,
		message_id: data.message_id,
		region: data.region,
		voice_states: data.voice_states,
		ringing: data.ringing,
	};

	DimensionStore.handleCallCreate(data.channel_id);
	CallAvailabilityStore.setCallAvailable(data.channel_id);
	CallStateStore.handleCallCreate({channelId: data.channel_id, call: callData});
}
