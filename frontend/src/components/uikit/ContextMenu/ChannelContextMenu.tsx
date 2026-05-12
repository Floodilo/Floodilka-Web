/*
 * SPDX-License-Identifier: AGPL-3.0-or-later
 * Copyright (C) 2020-2026 Fluxer Contributors
 * Copyright (C) 2026 Floodilka Contributors
 * Modified by Floodilka Contributors starting March 2026. See LICENSE and NOTICE.
 */

import {observer} from 'mobx-react-lite';
import type React from 'react';
import {Permissions} from '~/Constants';
import type {ChannelRecord} from '~/records/ChannelRecord';
import PermissionStore from '~/stores/PermissionStore';
import UserSettingsStore from '~/stores/UserSettingsStore';
import {
	ChannelNotificationSettingsMenuItem,
	CopyChannelIdMenuItem,
	CopyChannelLinkMenuItem,
	DeleteChannelMenuItem,
	EditChannelMenuItem,
	InvitePeopleToChannelMenuItem,
	MarkChannelAsReadMenuItem,
	MuteChannelMenuItem,
} from './items/ChannelMenuItems';
import {DebugChannelMenuItem} from './items/DebugMenuItems';
import {MenuGroup} from './MenuGroup';

interface ChannelContextMenuProps {
	channel: ChannelRecord;
	onClose: () => void;
}

export const ChannelContextMenu: React.FC<ChannelContextMenuProps> = observer(({channel, onClose}) => {
	const canManageChannels = PermissionStore.can(Permissions.MANAGE_CHANNELS, {
		channelId: channel.id,
		guildId: channel.guildId,
	});
	const developerMode = UserSettingsStore.developerMode;

	return (
		<>
			<MenuGroup>
				<MarkChannelAsReadMenuItem channel={channel} onClose={onClose} />
			</MenuGroup>

			<MenuGroup>
				<InvitePeopleToChannelMenuItem channel={channel} onClose={onClose} />
				<CopyChannelLinkMenuItem channel={channel} onClose={onClose} />
			</MenuGroup>

			<MenuGroup>
				<MuteChannelMenuItem channel={channel} onClose={onClose} />
				<ChannelNotificationSettingsMenuItem channel={channel} onClose={onClose} />
			</MenuGroup>

			{canManageChannels && (
				<MenuGroup>
					<EditChannelMenuItem channel={channel} onClose={onClose} />
					<DeleteChannelMenuItem channel={channel} onClose={onClose} />
				</MenuGroup>
			)}

			{developerMode && (
				<MenuGroup>
					<DebugChannelMenuItem channel={channel} onClose={onClose} />
				</MenuGroup>
			)}

			<MenuGroup>
				<CopyChannelIdMenuItem channel={channel} onClose={onClose} />
			</MenuGroup>
		</>
	);
});
