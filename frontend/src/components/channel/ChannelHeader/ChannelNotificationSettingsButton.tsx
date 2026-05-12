/*
 * SPDX-License-Identifier: AGPL-3.0-or-later
 * Copyright (C) 2020-2026 Fluxer Contributors
 * Copyright (C) 2026 Floodilka Contributors
 * Modified by Floodilka Contributors starting March 2026. See LICENSE and NOTICE.
 */

import {useLingui} from '@lingui/react/macro';
import {BellIcon, BellSlashIcon} from '@phosphor-icons/react';
import {observer} from 'mobx-react-lite';
import React from 'react';
import * as ContextMenuActionCreators from '~/actions/ContextMenuActionCreators';
import type {ChannelRecord} from '~/records/ChannelRecord';
import UserGuildSettingsStore from '~/stores/UserGuildSettingsStore';
import {ChannelHeaderIcon} from './ChannelHeaderIcon';
import {ChannelNotificationSettingsDropdown} from './ChannelNotificationSettingsDropdown';

export const ChannelNotificationSettingsButton = observer(({channel}: {channel: ChannelRecord}) => {
	const {t} = useLingui();
	const [isMenuOpen, setIsMenuOpen] = React.useState(false);

	const channelOverride = UserGuildSettingsStore.getChannelOverride(channel.guildId ?? null, channel.id);
	const isMuted = channelOverride?.muted ?? false;

	const handleClick = React.useCallback(
		(event: React.MouseEvent<HTMLButtonElement>) => {
			event.preventDefault();
			event.stopPropagation();
			setIsMenuOpen(true);

			ContextMenuActionCreators.openFromElementBottomRight(event, ({onClose}) => (
				<ChannelNotificationSettingsDropdown
					channel={channel}
					onClose={() => {
						setIsMenuOpen(false);
						onClose();
					}}
				/>
			));
		},
		[channel],
	);

	return (
		<ChannelHeaderIcon
			icon={isMuted ? BellSlashIcon : BellIcon}
			label={isMuted ? t`Notification Settings (Muted)` : t`Notification Settings`}
			isSelected={isMenuOpen || isMuted}
			onClick={handleClick}
		/>
	);
});
