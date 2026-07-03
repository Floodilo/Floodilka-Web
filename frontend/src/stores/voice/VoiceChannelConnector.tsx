/*
 * SPDX-License-Identifier: AGPL-3.0-or-later
 * Copyright (C) 2020-2026 Fluxer Contributors
 * Copyright (C) 2026 Floodilka Contributors
 * Modified by Floodilka Contributors starting March 2026. See LICENSE and NOTICE.
 */

import * as ModalActionCreators from '~/actions/ModalActionCreators';
import {modal} from '~/actions/ModalActionCreators';
import {VoiceChannelFullModal} from '~/components/alerts/VoiceChannelFullModal';
import {VoiceConnectionConfirmModal} from '~/components/alerts/VoiceConnectionConfirmModal';
import {Logger} from '~/lib/Logger';
import ChannelStore from '~/stores/ChannelStore';
import ConnectionStore from '~/stores/ConnectionStore';
import LocalVoiceStateStore from '~/stores/LocalVoiceStateStore';
import UserStore from '~/stores/UserStore';
import VoiceConnectionManager from './VoiceConnectionManager';
import VoiceStateManager from './VoiceStateManager';

const logger = new Logger('VoiceChannelConnector');

export function checkChannelLimit(guildId: string | null, channelId: string): boolean {
	if (!guildId) return true;

	const channel = ChannelStore.getChannel(channelId);
	if (!channel?.userLimit || channel.userLimit <= 0) return true;

	const voiceStates = VoiceStateManager.getAllVoiceStatesInChannel(guildId, channelId);
	const count = Object.keys(voiceStates).length;
	const user = UserStore.getCurrentUser();
	const already = user && voiceStates[user.id];
	const adjusted = already ? count - 1 : count;

	if (adjusted >= channel.userLimit) {
		ModalActionCreators.push(modal(() => <VoiceChannelFullModal />));
		return false;
	}

	return true;
}

export function checkMultipleConnections(
	guildId: string | null,
	channelId: string,
	onSwitchDevice: () => Promise<void>,
	onCancel: () => void,
): boolean {
	if (!guildId) return true;

	const user = UserStore.getCurrentUser();
	if (!user) return true;

	const socket = ConnectionStore.socket;
	if (!socket) return true;

	const voiceStates = VoiceStateManager.getAllVoiceStatesInChannel(guildId, channelId);
	const currentConnectionId = VoiceConnectionManager.connectionId;
	const userStates = Object.values(voiceStates).filter(
		(vs) => vs.user_id === user.id && vs.connection_id !== currentConnectionId,
	);

	if (userStates.length > 0) {
		ModalActionCreators.push(
			modal(() => (
				<VoiceConnectionConfirmModal
					guildId={guildId}
					channelId={channelId}
					onSwitchDevice={onSwitchDevice}
					onCancel={onCancel}
				/>
			)),
		);
		return false;
	}

	return true;
}

export function sendVoiceStateConnect(guildId: string | null, channelId: string): void {
	const socket = ConnectionStore.socket;
	if (!socket) {
		logger.warn('[sendVoiceStateConnect] No socket');
		return;
	}

	LocalVoiceStateStore.ensurePermissionMute();

	socket.updateVoiceState({
		guild_id: guildId,
		channel_id: channelId,
		self_mute: LocalVoiceStateStore.getSelfMute(),
		self_deaf: LocalVoiceStateStore.getSelfDeaf(),
		self_video: false,
		self_stream: false,
		viewer_stream_key: null,
		// A join must always request a fresh connection: the gateway treats a known
		// connection_id as an in-place update (needs_token=false) and never sends
		// VOICE_SERVER_UPDATE, leaving the client stuck in "connecting" until timeout.
		connection_id: null,
	});
}

export function sendVoiceStateDisconnect(guildId: string | null, connectionId: string): void {
	const socket = ConnectionStore.socket;
	if (!socket) {
		logger.warn('[sendVoiceStateDisconnect] No socket');
		return;
	}

	socket.updateVoiceState({
		guild_id: guildId,
		channel_id: null,
		self_mute: true,
		self_deaf: true,
		self_video: false,
		self_stream: false,
		viewer_stream_key: null,
		connection_id: connectionId,
	});
}

export function syncVoiceStateToServer(
	guildId: string | null,
	channelId: string,
	connectionId: string,
	partial?: {
		self_video?: boolean;
		self_stream?: boolean;
		self_mute?: boolean;
		self_deaf?: boolean;
		viewer_stream_key?: string | null;
	},
): void {
	const socket = ConnectionStore.socket;
	if (!socket) return;

	socket.updateVoiceState({
		guild_id: guildId,
		channel_id: channelId,
		self_mute: partial?.self_mute ?? LocalVoiceStateStore.getSelfMute(),
		self_deaf: partial?.self_deaf ?? LocalVoiceStateStore.getSelfDeaf(),
		self_video: partial?.self_video ?? LocalVoiceStateStore.getSelfVideo(),
		self_stream: partial?.self_stream ?? LocalVoiceStateStore.getSelfStream(),
		viewer_stream_key: partial?.viewer_stream_key ?? LocalVoiceStateStore.getViewerStreamKey(),
		connection_id: connectionId,
	});
}
