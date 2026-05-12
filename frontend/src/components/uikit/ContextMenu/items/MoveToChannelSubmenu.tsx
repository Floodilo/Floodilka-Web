/*
 * SPDX-License-Identifier: AGPL-3.0-or-later
 * Copyright (C) 2020-2026 Fluxer Contributors
 * Copyright (C) 2026 Floodilka Contributors
 * Modified by Floodilka Contributors starting March 2026. See LICENSE and NOTICE.
 */

import {useLingui} from '@lingui/react/macro';
import {ArrowsLeftRightIcon} from '@phosphor-icons/react';
import {observer} from 'mobx-react-lite';
import React from 'react';
import * as GuildMemberActionCreators from '~/actions/GuildMemberActionCreators';
import * as VoiceStateActionCreators from '~/actions/VoiceStateActionCreators';
import {ChannelTypes, Permissions} from '~/Constants';
import ChannelStore from '~/stores/ChannelStore';
import ConnectionStore from '~/stores/ConnectionStore';
import PermissionStore from '~/stores/PermissionStore';
import UserStore from '~/stores/UserStore';
import MediaEngineStore from '~/stores/voice/MediaEngineFacade';
import {MenuGroup} from '../MenuGroup';
import {MenuItem} from '../MenuItem';
import {MenuItemSubmenu} from '../MenuItemSubmenu';

interface MoveToChannelSubmenuProps {
	userId: string;
	guildId: string;
	connectionId?: string;
	connectionIds?: Array<string>;
	onClose: () => void;
	label?: string;
}

export const MoveToChannelSubmenu: React.FC<MoveToChannelSubmenuProps> = observer(
	({userId, guildId, connectionId, connectionIds, onClose, label}) => {
		const {t} = useLingui();
		const channels = ChannelStore.getGuildChannels(guildId);
		const userVoiceState = MediaEngineStore.getVoiceState(guildId, userId);
		const currentUser = UserStore.currentUser;
		const isSelf = currentUser?.id === userId;

		const voiceChannels = React.useMemo(() => {
			return channels.filter((channel) => {
				if (channel.type !== ChannelTypes.GUILD_VOICE) {
					return false;
				}

				if (userVoiceState?.channel_id === channel.id) {
					return false;
				}

				const canConnect = PermissionStore.can(Permissions.CONNECT, {
					guildId,
					channelId: channel.id,
				});

				return canConnect;
			});
		}, [channels, guildId, userVoiceState]);

		const handleMoveToChannel = React.useCallback(
			async (channelId: string) => {
				onClose();

				if (connectionIds && connectionIds.length > 0) {
					try {
						await VoiceStateActionCreators.bulkMoveConnections(connectionIds, channelId);
					} catch (error) {
						console.error('Failed to bulk move connections:', error);
					}
					return;
				}

				if (isSelf) {
					const socket = ConnectionStore.socket;
					if (socket) {
						socket.updateVoiceState({
							guild_id: guildId,
							channel_id: channelId,
							self_mute: true,
							self_deaf: true,
							self_video: false,
							self_stream: false,
							connection_id: MediaEngineStore.connectionId ?? null,
						});
					}
				} else {
					try {
						await GuildMemberActionCreators.update(guildId, userId, {
							channel_id: channelId,
							connection_id: connectionId,
						});
					} catch (error) {
						console.error('Failed to move member to channel:', error);
					}
				}
			},
			[guildId, userId, connectionId, connectionIds, onClose, isSelf],
		);

		if (voiceChannels.length === 0) {
			return null;
		}

		return (
			<MenuItemSubmenu
				icon={<ArrowsLeftRightIcon weight="fill" style={{width: 16, height: 16}} />}
				label={label ?? t`Move To...`}
				render={() => (
					<MenuGroup>
						{voiceChannels.map((channel) => (
							<MenuItem key={channel.id} onClick={() => handleMoveToChannel(channel.id)}>
								{channel.name}
							</MenuItem>
						))}
					</MenuGroup>
				)}
			/>
		);
	},
);
