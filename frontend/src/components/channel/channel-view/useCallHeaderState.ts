/*
 * SPDX-License-Identifier: AGPL-3.0-or-later
 * Copyright (C) 2020-2026 Fluxer Contributors
 * Copyright (C) 2026 Floodilka Contributors
 * Modified by Floodilka Contributors starting March 2026. See LICENSE and NOTICE.
 */

import type {ChannelRecord} from '~/records/ChannelRecord';
import AuthenticationStore from '~/stores/AuthenticationStore';
import CallStateStore, {type Call} from '~/stores/CallStateStore';
import MediaEngineStore from '~/stores/voice/MediaEngineFacade';

export type CallHeaderControlsVariant = 'incoming' | 'join' | 'connecting' | 'inCall' | 'hidden';

export interface CallHeaderState {
	call: Call | null;
	callExistsAndOngoing: boolean;
	controlsVariant: CallHeaderControlsVariant;
	isDeviceInRoomForChannelCall: boolean;
	isDeviceConnectingToChannelCall: boolean;
	isRingingForCurrentUserOnThisDevice: boolean;
}

export function useCallHeaderState(channel?: ChannelRecord | null): CallHeaderState {
	const channelId = channel?.id ?? null;
	const call = channelId ? (CallStateStore.getCall(channelId) ?? null) : null;
	const hasParticipants = channelId && call ? CallStateStore.getParticipants(channelId).length > 0 : false;
	const callHasPendingRinging = Boolean(call && call.ringing.length > 0);
	const callExistsAndOngoing = Boolean(call && (call.region !== null || hasParticipants || callHasPendingRinging));

	const currentUserId = AuthenticationStore.currentUserId;
	const isRingingForCurrentUserOnThisDevice = Boolean(
		currentUserId && channelId && CallStateStore.isUserPendingRinging(channelId, currentUserId),
	);

	const normalizedGuildId = channel?.guildId ?? null;
	const matchesConnectionContext = Boolean(
		channelId && MediaEngineStore.channelId === channelId && (MediaEngineStore.guildId ?? null) === normalizedGuildId,
	);
	const isDeviceInRoomForChannelCall = Boolean(MediaEngineStore.room && matchesConnectionContext);
	const isDeviceConnectingToChannelCall =
		matchesConnectionContext && (MediaEngineStore.connecting || (MediaEngineStore.connected && !MediaEngineStore.room));

	const controlsVariant: CallHeaderControlsVariant = !callExistsAndOngoing
		? 'hidden'
		: isDeviceInRoomForChannelCall
			? 'inCall'
			: isRingingForCurrentUserOnThisDevice
				? 'incoming'
				: isDeviceConnectingToChannelCall
					? 'connecting'
					: 'join';

	return {
		call,
		callExistsAndOngoing,
		controlsVariant,
		isDeviceInRoomForChannelCall,
		isDeviceConnectingToChannelCall,
		isRingingForCurrentUserOnThisDevice,
	};
}
