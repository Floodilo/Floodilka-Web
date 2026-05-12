/*
 * SPDX-License-Identifier: AGPL-3.0-or-later
 * Copyright (C) 2020-2026 Fluxer Contributors
 * Copyright (C) 2026 Floodilka Contributors
 * Modified by Floodilka Contributors starting March 2026. See LICENSE and NOTICE.
 */

import {observer} from 'mobx-react-lite';
import React from 'react';
import type {ChannelRecord} from '~/records/ChannelRecord';
import type {GuildRecord} from '~/records/GuildRecord';
import LocalVoiceStateStore from '~/stores/LocalVoiceStateStore';
import UserStore from '~/stores/UserStore';
import type {VoiceState} from '~/stores/voice/MediaEngineFacade';
import MediaEngineStore from '~/stores/voice/MediaEngineFacade';
import {GroupedVoiceParticipant} from './GroupedVoiceParticipant';
import {VoiceParticipantItem} from './VoiceParticipantItem';
import styles from './VoiceParticipantsList.module.css';

export const VoiceParticipantsList = observer(({guild, channel}: {guild: GuildRecord; channel: ChannelRecord}) => {
	const voiceStates = MediaEngineStore.getAllVoiceStatesInChannel(guild.id, channel.id);
	const currentUser = UserStore.currentUser;
	const localSelfStream = LocalVoiceStateStore.selfStream;

	const grouped = React.useMemo(() => {
		const byUser = new Map<
			string,
			{
				userId: string;
				states: Array<VoiceState>;
				isCurrentUser: boolean;
				anySpeaking: boolean;
				anyLive: boolean;
			}
		>();

		for (const vs of Object.values(voiceStates)) {
			const userId = vs.user_id;
			let entry = byUser.get(userId);
			if (!entry) {
				entry = {userId, states: [], isCurrentUser: currentUser?.id === userId, anySpeaking: false, anyLive: false};
				byUser.set(userId, entry);
			}
			entry.states.push(vs);

			const connectionId = vs.connection_id ?? '';
			const participant = MediaEngineStore.getParticipantByUserIdAndConnectionId(userId, connectionId);
			const isSelfMuted = vs.self_mute ?? (participant ? !participant.isMicrophoneEnabled : false);
			const isGuildMuted = vs.mute ?? false;
			const speaking = !!(participant?.isSpeaking && !isSelfMuted && !isGuildMuted);
			const live = vs.self_stream === true || (participant ? participant.isScreenShareEnabled : false);

			entry.anySpeaking = entry.anySpeaking || speaking;
			entry.anyLive = entry.anyLive || live;

			if (entry.isCurrentUser) {
				entry.anyLive = entry.anyLive || localSelfStream;
			}
		}

		return Array.from(byUser.values()).sort((a, b) => {
			if (a.isCurrentUser !== b.isCurrentUser) return a.isCurrentUser ? -1 : 1;
			if (a.anyLive !== b.anyLive) return a.anyLive ? -1 : 1;
			if (a.anySpeaking !== b.anySpeaking) return a.anySpeaking ? -1 : 1;
			return a.userId.localeCompare(b.userId);
		});
	}, [voiceStates, currentUser, localSelfStream]);

	if (grouped.length === 0) return null;

	return (
		<div className={styles.container}>
			{grouped.map(({userId, states, isCurrentUser, anySpeaking}) => {
				const user = UserStore.getUser(userId);
				if (!user) return null;

				if (states.length === 1) {
					return (
						<VoiceParticipantItem
							key={userId}
							user={user}
							voiceState={states[0]}
							guildId={guild.id}
							isCurrentUser={isCurrentUser}
						/>
					);
				}

				return (
					<GroupedVoiceParticipant
						key={userId}
						user={user}
						voiceStates={states}
						guildId={guild.id}
						anySpeaking={anySpeaking}
					/>
				);
			})}
		</div>
	);
});
