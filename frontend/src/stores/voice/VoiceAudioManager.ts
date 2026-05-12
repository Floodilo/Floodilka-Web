/*
 * SPDX-License-Identifier: AGPL-3.0-or-later
 * Copyright (C) 2020-2026 Fluxer Contributors
 * Copyright (C) 2026 Floodilka Contributors
 * Modified by Floodilka Contributors starting March 2026. See LICENSE and NOTICE.
 */

import type {LocalTrackPublication, Room} from 'livekit-client';
import {Track} from 'livekit-client';
import {Logger} from '~/lib/Logger';
import KeybindStore from '~/stores/KeybindStore';
import LocalVoiceStateStore from '~/stores/LocalVoiceStateStore';
import ParticipantVolumeStore from '~/stores/ParticipantVolumeStore';
import type {VoiceState} from './VoiceStateManager';

const logger = new Logger('VoiceAudioManager');

const extractUserId = (identity: string): string | null => {
	const match = identity.match(/^user_(\d+)(?:_(.+))?$/);
	return match ? match[1] : null;
};

export function applyLocalAudioPreferencesForUser(userId: string, room: Room | null): void {
	if (!room) {
		logger.warn('[applyLocalAudioPreferencesForUser] No room');
		return;
	}

	const selfDeaf = LocalVoiceStateStore.getSelfDeaf();

	room.remoteParticipants.forEach((p) => {
		if (extractUserId(p.identity) !== userId) return;
		ParticipantVolumeStore.applySettingsToParticipant(p, selfDeaf);
	});
}

export function applyAllLocalAudioPreferences(room: Room | null): void {
	if (!room) {
		logger.warn('[applyAllLocalAudioPreferences] No room');
		return;
	}

	const selfDeaf = LocalVoiceStateStore.getSelfDeaf();
	ParticipantVolumeStore.applySettingsToRoom(room, selfDeaf);
}

function setPublicationsMuted(room: Room | null, muted: boolean): void {
	if (!room?.localParticipant) return;

	room.localParticipant.audioTrackPublications.forEach((publication: LocalTrackPublication) => {
		if (publication.source === Track.Source.ScreenShareAudio) return;
		if (publication.isMuted === muted) return;
		const op = muted ? publication.mute() : publication.unmute();
		op.catch((error) => logger.error(muted ? 'Failed to mute publication' : 'Failed to unmute publication', {error}));
	});
}

function computeTransmissionMuted(voiceState: VoiceState | null): boolean {
	if (voiceState?.mute) return true;
	if (LocalVoiceStateStore.getSelfMute()) return true;
	if (LocalVoiceStateStore.getSelfDeaf()) return true;
	if (KeybindStore.isPushToTalkEffective() && !KeybindStore.isPushToTalkTransmitting()) return true;
	return false;
}

export function reconcileTransmissionState(room: Room | null, voiceState: VoiceState | null): void {
	setPublicationsMuted(room, computeTransmissionMuted(voiceState));
}

export function applyPushToTalkHold(
	held: boolean,
	room: Room | null,
	getCurrentUserVoiceState: () => VoiceState | null,
): void {
	KeybindStore.setPushToTalkHeld(held);

	if (!KeybindStore.isPushToTalkEnabled()) return;

	reconcileTransmissionState(room, getCurrentUserVoiceState());
}

export function handlePushToTalkModeChange(room: Room | null, getCurrentUserVoiceState: () => VoiceState | null): void {
	if (KeybindStore.isPushToTalkEffective()) {
		KeybindStore.resetPushToTalkState();
	}

	reconcileTransmissionState(room, getCurrentUserVoiceState());
}

export function getMuteReason(voiceState: VoiceState | null): 'guild' | 'self' | null {
	if (voiceState?.mute) return 'guild';
	const selfMuted = voiceState?.self_mute ?? LocalVoiceStateStore.getSelfMute();
	if (selfMuted) return 'self';
	return null;
}
