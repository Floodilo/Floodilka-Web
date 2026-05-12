/*
 * SPDX-License-Identifier: AGPL-3.0-or-later
 * Copyright (C) 2020-2026 Fluxer Contributors
 * Copyright (C) 2026 Floodilka Contributors
 * Modified by Floodilka Contributors starting March 2026. See LICENSE and NOTICE.
 */

import {clsx} from 'clsx';
import {observer} from 'mobx-react-lite';
import type {ChannelRecord} from '~/records/ChannelRecord';
import type {GuildRecord} from '~/records/GuildRecord';
import UserStore from '~/stores/UserStore';
import MediaEngineStore from '~/stores/voice/MediaEngineFacade';
import {AvatarWithPresence} from './AvatarWithPresence';
import styles from './StackUserAvatar.module.css';

interface StackUserAvatarProps {
	guild: GuildRecord;
	channel: ChannelRecord;
	userId: string;
	size?: number;
	className?: string;
}

export const StackUserAvatar = observer(({guild, channel, userId, size = 28, className}: StackUserAvatarProps) => {
	const channelStates = MediaEngineStore.getAllVoiceStatesInChannel(guild.id, channel.id);
	const user = UserStore.getUser(userId);
	if (!user) return null;

	let speaking = false;
	for (const state of Object.values(channelStates)) {
		if (state.user_id !== userId) continue;
		const connectionId = state.connection_id ?? '';
		const participant = MediaEngineStore.getParticipantByUserIdAndConnectionId(userId, connectionId);
		const selfMuted = state.self_mute ?? (participant ? !participant.isMicrophoneEnabled : false);
		const guildMuted = state.mute ?? false;

		speaking ||= !!(participant?.isSpeaking && !selfMuted && !guildMuted);
	}

	return (
		<AvatarWithPresence
			user={user}
			size={size}
			speaking={speaking}
			className={clsx(styles.container, className)}
			title={user.username}
		/>
	);
});
