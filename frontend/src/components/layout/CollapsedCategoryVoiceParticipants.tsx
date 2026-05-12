/*
 * SPDX-License-Identifier: AGPL-3.0-or-later
 * Copyright (C) 2020-2026 Fluxer Contributors
 * Copyright (C) 2026 Floodilka Contributors
 * Modified by Floodilka Contributors starting March 2026. See LICENSE and NOTICE.
 */

import {SpeakerHighIcon} from '@phosphor-icons/react';
import {observer} from 'mobx-react-lite';
import React from 'react';
import {AvatarStack} from '~/components/uikit/avatars/AvatarStack';
import {StackUserAvatar} from '~/components/uikit/avatars/StackUserAvatar';
import type {ChannelRecord} from '~/records/ChannelRecord';
import type {GuildRecord} from '~/records/GuildRecord';
import MediaEngineStore from '~/stores/voice/MediaEngineFacade';
import styles from './CollapsedCategoryVoiceParticipants.module.css';

export const CollapsedCategoryVoiceParticipants = observer(
	({guild, voiceChannels}: {guild: GuildRecord; voiceChannels: Array<ChannelRecord>}) => {
		const allVoiceStates = MediaEngineStore.getAllVoiceStates();

		const userIds = React.useMemo(() => {
			const ids = new Set<string>();
			for (const channel of voiceChannels) {
				const states = allVoiceStates[guild.id]?.[channel.id];
				if (!states) continue;
				for (const s of Object.values(states)) ids.add(s.user_id);
			}
			return Array.from(ids).sort((a, b) => a.localeCompare(b));
		}, [voiceChannels, allVoiceStates, guild.id]);

		if (userIds.length === 0) return null;

		const firstChannelForUser = (uid: string): ChannelRecord | undefined =>
			voiceChannels.find((ch) => {
				const states = allVoiceStates[guild.id]?.[ch.id];
				return !!states && Object.values(states).some((s) => s.user_id === uid);
			});

		return (
			<div className={styles.container}>
				<SpeakerHighIcon className={styles.icon} />
				<AvatarStack size={28} maxVisible={7}>
					{userIds.map((uid) => {
						const ch = firstChannelForUser(uid);
						if (!ch) return null;
						return <StackUserAvatar key={uid} guild={guild} channel={ch} userId={uid} />;
					})}
				</AvatarStack>
			</div>
		);
	},
);

export const CollapsedChannelAvatarStack = observer(
	({guild, channel}: {guild: GuildRecord; channel: ChannelRecord}) => {
		const channelStates = MediaEngineStore.getAllVoiceStatesInChannel(guild.id, channel.id);

		const uniqueUserIds = React.useMemo(() => {
			const set = new Set<string>();
			for (const s of Object.values(channelStates)) set.add(s.user_id);
			return Array.from(set);
		}, [channelStates]);

		return (
			<div className={styles.channelContainer}>
				<AvatarStack size={28} maxVisible={10}>
					{uniqueUserIds.map((uid) => (
						<StackUserAvatar key={uid} guild={guild} channel={channel} userId={uid} />
					))}
				</AvatarStack>
			</div>
		);
	},
);
