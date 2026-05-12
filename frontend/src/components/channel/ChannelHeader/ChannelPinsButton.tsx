/*
 * SPDX-License-Identifier: AGPL-3.0-or-later
 * Copyright (C) 2020-2026 Fluxer Contributors
 * Copyright (C) 2026 Floodilka Contributors
 * Modified by Floodilka Contributors starting March 2026. See LICENSE and NOTICE.
 */

import {useLingui} from '@lingui/react/macro';
import {PushPinIcon} from '@phosphor-icons/react';
import {observer} from 'mobx-react-lite';
import React from 'react';
import {ChannelPinsBottomSheet} from '~/components/bottomsheets/ChannelPinsBottomSheet';
import {ChannelPinsPopout} from '~/components/popouts/ChannelPinsPopout';
import {Popout} from '~/components/uikit/Popout/Popout';
import {usePopout} from '~/hooks/usePopout';
import type {ChannelRecord} from '~/records/ChannelRecord';
import MobileLayoutStore from '~/stores/MobileLayoutStore';
import ReadStateStore from '~/stores/ReadStateStore';
import styles from '../ChannelHeader.module.css';
import {ChannelHeaderIcon} from './ChannelHeaderIcon';

export const ChannelPinsButton = observer(({channel}: {channel: ChannelRecord}) => {
	const {t} = useLingui();
	const {isOpen, openProps} = usePopout('channel-pins');
	const isMobile = MobileLayoutStore.isMobileLayout();
	const [isBottomSheetOpen, setIsBottomSheetOpen] = React.useState(false);
	const hasUnreadPins = ReadStateStore.hasUnreadPins(channel.id);

	const handleClick = React.useCallback(() => {
		if (isMobile) {
			setIsBottomSheetOpen(true);
		}
	}, [isMobile]);

	const indicator = hasUnreadPins ? <div className={styles.unreadPinIndicator} /> : null;

	if (isMobile) {
		return (
			<>
				<div className={styles.iconButtonWrapper}>
					<ChannelHeaderIcon
						icon={PushPinIcon}
						label={t`Pinned Messages`}
						isSelected={isBottomSheetOpen}
						onClick={handleClick}
						keybindAction="toggle_pins_popout"
					/>
					{indicator}
				</div>
				<ChannelPinsBottomSheet
					isOpen={isBottomSheetOpen}
					onClose={() => setIsBottomSheetOpen(false)}
					channel={channel}
				/>
			</>
		);
	}

	return (
		<Popout
			{...openProps}
			render={() => <ChannelPinsPopout channel={channel} />}
			position="bottom-end"
			subscribeTo="CHANNEL_PINS_OPEN"
		>
			<div className={styles.iconButtonWrapper}>
				<ChannelHeaderIcon
					icon={PushPinIcon}
					label={t`Pinned Messages`}
					isSelected={isOpen}
					keybindAction="toggle_pins_popout"
				/>
				{indicator}
			</div>
		</Popout>
	);
});
