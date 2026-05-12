/*
 * SPDX-License-Identifier: AGPL-3.0-or-later
 * Copyright (C) 2020-2026 Fluxer Contributors
 * Copyright (C) 2026 Floodilka Contributors
 * Modified by Floodilka Contributors starting March 2026. See LICENSE and NOTICE.
 */

import {useAudioPlayback} from '@livekit/components-react';
import type {Room} from 'livekit-client';
import {observer} from 'mobx-react-lite';
import {useEffect, useRef} from 'react';
import * as ModalActionCreators from '~/actions/ModalActionCreators';
import {modal} from '~/actions/ModalActionCreators';
import {AudioPlaybackPermissionModal} from '~/components/modals/AudioPlaybackPermissionModal';
import {Logger} from '~/lib/Logger';
import ConnectionStore from '~/stores/ConnectionStore';
import MediaEngineStore from '~/stores/voice/MediaEngineFacade';

const logger = new Logger('VoiceReconnectionManager');

const AutoReconnectHandler = observer(() => {
	const socket = ConnectionStore.socket;
	const hasAttemptedReconnection = useRef(false);

	useEffect(() => {
		if (!socket || hasAttemptedReconnection.current) {
			return;
		}

		const lastChannel = MediaEngineStore.getLastConnectedChannel();
		const shouldReconnect = MediaEngineStore.getShouldReconnect();

		if (lastChannel && shouldReconnect) {
			logger.info('Attempting to reconnect to last voice channel', lastChannel);
			hasAttemptedReconnection.current = true;

			setTimeout(() => {
				const stillShouldReconnect = MediaEngineStore.getShouldReconnect();
				if (stillShouldReconnect) {
					MediaEngineStore.connectToVoiceChannel(lastChannel.guildId, lastChannel.channelId);
					MediaEngineStore.markReconnectionAttempted();
				} else {
					logger.info('Reconnection was cancelled, skipping');
				}
			}, 1500);
		}
	}, [socket]);

	return null;
});

const AudioPlaybackHandler = observer(({room}: {room: Room}) => {
	const {canPlayAudio, startAudio} = useAudioPlayback(room);
	const hasShownAudioModal = useRef(false);

	useEffect(() => {
		if (hasShownAudioModal.current) {
			return;
		}

		if (!canPlayAudio && MediaEngineStore.connected) {
			hasShownAudioModal.current = true;
			logger.info('Audio playback not allowed, showing permission modal');

			ModalActionCreators.pushWithKey(
				modal(() => (
					<AudioPlaybackPermissionModal
						onStartAudio={async () => {
							try {
								await startAudio();
								logger.info('Audio playback enabled');
							} catch (error) {
								logger.error('Failed to enable audio playback', error);
							}
						}}
					/>
				)),
				'audio-playback-permission',
			);
		}
	}, [canPlayAudio, startAudio]);

	return null;
});

export const VoiceReconnectionManager = observer(() => {
	const room = MediaEngineStore.room;

	return (
		<>
			<AutoReconnectHandler />
			{room && <AudioPlaybackHandler room={room} />}
		</>
	);
});
