/*
 * SPDX-License-Identifier: AGPL-3.0-or-later
 * Copyright (C) 2020-2026 Fluxer Contributors
 * Copyright (C) 2026 Floodilka Contributors
 * Modified by Floodilka Contributors starting March 2026. See LICENSE and NOTICE.
 */

import {useLingui} from '@lingui/react/macro';
import {observer} from 'mobx-react-lite';
import {useCallback, useMemo} from 'react';
import * as ReadStateActionCreators from '~/actions/ReadStateActionCreators';
import {openGuildFolderSettingsModal} from '~/components/modals/GuildFolderSettingsModal';
import {MarkAsReadIcon, SettingsIcon} from '~/components/uikit/ContextMenu/ContextMenuIcons';
import {MenuGroup} from '~/components/uikit/ContextMenu/MenuGroup';
import {MenuItem} from '~/components/uikit/ContextMenu/MenuItem';
import type {GuildRecord} from '~/records/GuildRecord';
import ChannelStore from '~/stores/ChannelStore';
import GuildReadStateStore from '~/stores/GuildReadStateStore';
import type {GuildFolder} from '~/stores/UserSettingsStore';

interface GuildFolderContextMenuProps {
	folder: GuildFolder;
	guilds: Array<GuildRecord>;
	onClose: () => void;
}

export const GuildFolderContextMenu: React.FC<GuildFolderContextMenuProps> = observer(({folder, guilds, onClose}) => {
	const {t} = useLingui();

	const hasUnreads = useMemo(() => {
		return guilds.some((guild) => GuildReadStateStore.hasUnread(guild.id));
	}, [guilds]);

	const handleMarkFolderAsRead = useCallback(() => {
		const channelIds: Array<string> = [];

		for (const guild of guilds) {
			const channels = ChannelStore.getGuildChannels(guild.id);
			for (const channel of channels) {
				channelIds.push(channel.id);
			}
		}

		if (channelIds.length > 0) {
			void ReadStateActionCreators.bulkAckChannels(channelIds);
		}

		onClose();
	}, [guilds, onClose]);

	const handleFolderSettings = useCallback(() => {
		if (folder.id != null) {
			openGuildFolderSettingsModal(folder.id);
		}
		onClose();
	}, [folder.id, onClose]);

	return (
		<>
			<MenuGroup>
				<MenuItem icon={<MarkAsReadIcon />} onClick={handleMarkFolderAsRead} disabled={!hasUnreads}>
					{t`Mark Folder as Read`}
				</MenuItem>
			</MenuGroup>

			<MenuGroup>
				<MenuItem icon={<SettingsIcon />} onClick={handleFolderSettings}>
					{t`Folder Settings`}
				</MenuItem>
			</MenuGroup>
		</>
	);
});
