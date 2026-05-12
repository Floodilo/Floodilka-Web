/*
 * SPDX-License-Identifier: AGPL-3.0-or-later
 * Copyright (C) 2020-2026 Fluxer Contributors
 * Copyright (C) 2026 Floodilka Contributors
 * Modified by Floodilka Contributors starting March 2026. See LICENSE and NOTICE.
 */

import type {User} from '~/records/UserRecord';
import UserStore from '~/stores/UserStore';
import MediaEngineStore, {type VoiceState} from '~/stores/voice/MediaEngineFacade';
import type {GatewayHandlerContext} from '../index';

interface VoiceStateUpdatePayload {
	user_id: string;
	channel_id?: string | null;
	guild_id?: string | null;
	session_id?: string;
	connection_id?: string;
	self_mute?: boolean;
	self_deaf?: boolean;
	self_video?: boolean;
	self_stream?: boolean;
	mute?: boolean;
	deaf?: boolean;
	suppress?: boolean;
	member?: {user?: User};
}

export function handleVoiceStateUpdate(data: VoiceStateUpdatePayload, _context: GatewayHandlerContext): void {
	const guildId = data.guild_id ?? null;

	if (data.member?.user?.id) {
		UserStore.cacheUsers([data.member.user]);
	}

	const voiceState = data as VoiceState;
	MediaEngineStore.handleGatewayVoiceStateUpdate(guildId, voiceState);
}
