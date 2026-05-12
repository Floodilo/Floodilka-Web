/*
 * SPDX-License-Identifier: AGPL-3.0-or-later
 * Copyright (C) 2020-2026 Fluxer Contributors
 * Copyright (C) 2026 Floodilka Contributors
 * Modified by Floodilka Contributors starting March 2026. See LICENSE and NOTICE.
 */

import type {Room} from 'livekit-client';
import {Track} from 'livekit-client';
import * as SoundActionCreators from '~/actions/SoundActionCreators';
import {Logger} from '~/lib/Logger';
import LocalVoiceStateStore from '~/stores/LocalVoiceStateStore';
import UserStore from '~/stores/UserStore';
import * as CustomSoundDB from '~/utils/CustomSoundDB';
import {SoundType} from '~/utils/SoundUtils';

const logger = new Logger('VoiceEntranceSoundManager');

export async function playEntranceSound(room: Room | null): Promise<void> {
	const user = UserStore.getCurrentUser();
	if (!user?.isPremium()) {
		SoundActionCreators.playSound(SoundType.UserJoin);
		return;
	}

	try {
		if (LocalVoiceStateStore.getSelfMute() || LocalVoiceStateStore.getSelfDeaf()) {
			SoundActionCreators.playSound(SoundType.UserJoin);
			return;
		}

		const entranceSound = await CustomSoundDB.getEntranceSound();
		if (!entranceSound) {
			SoundActionCreators.playSound(SoundType.UserJoin);
			return;
		}

		if (!room?.localParticipant) {
			SoundActionCreators.playSound(SoundType.UserJoin);
			return;
		}

		const audioContext = new AudioContext();
		const arrayBuffer = await entranceSound.blob.arrayBuffer();
		const audioBuffer = await audioContext.decodeAudioData(arrayBuffer);
		const source = audioContext.createBufferSource();
		source.buffer = audioBuffer;
		source.connect(audioContext.destination);

		const dest = audioContext.createMediaStreamDestination();
		source.connect(dest);

		const audioTrack = dest.stream.getAudioTracks()[0];
		if (!audioTrack) {
			SoundActionCreators.playSound(SoundType.UserJoin);
			await audioContext.close();
			return;
		}

		const participant = room.localParticipant;
		await participant.publishTrack(audioTrack, {
			name: 'entrance-sound',
			source: Track.Source.Microphone,
		});
		source.start();
		source.onended = async () => {
			try {
				const pubs = Array.from(participant.audioTrackPublications.values());
				const pub = pubs.find((p) => p.trackName === 'entrance-sound');
				if (pub?.track) {
					await participant.unpublishTrack(pub.track);
				}
				await audioContext.close();
			} catch (e) {
				logger.error('[playEntranceSound] Cleanup failed', e);
			}
		};
		logger.info('[playEntranceSound] Custom entrance sound played');
	} catch (e) {
		logger.error('[playEntranceSound] Failed', e);
		SoundActionCreators.playSound(SoundType.UserJoin);
	}
}
