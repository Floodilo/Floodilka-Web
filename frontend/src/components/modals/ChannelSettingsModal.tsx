/*
 * SPDX-License-Identifier: AGPL-3.0-or-later
 * Copyright (C) 2020-2026 Fluxer Contributors
 * Copyright (C) 2026 Floodilka Contributors
 * Modified by Floodilka Contributors starting March 2026. See LICENSE and NOTICE.
 */

import {useLingui} from '@lingui/react/macro';
import {observer} from 'mobx-react-lite';
import React from 'react';
import * as ModalActionCreators from '~/actions/ModalActionCreators';
import {ChannelTypes} from '~/Constants';
import * as Modal from '~/components/modals/Modal';
import ChannelStore from '~/stores/ChannelStore';
import ConnectionStore from '~/stores/gateway/ConnectionStore';
import MobileLayoutStore from '~/stores/MobileLayoutStore';
import {isMobileExperienceEnabled} from '~/utils/mobileExperience';
import {
	type ChannelSettingsModalProps,
	createHandleClose,
	getAvailableTabs,
	getGroupedSettingsTabs,
} from '~/utils/modals/ChannelSettingsModalUtils';
import {DesktopChannelSettingsView} from './components/DesktopChannelSettingsView';
import {MobileChannelSettingsView} from './components/MobileChannelSettingsView';
import {useMobileNavigation} from './hooks/useMobileNavigation';
import {SettingsModalContainer} from './shared/SettingsModalLayout';
import type {ChannelSettingsTabType} from './utils/channelSettingsConstants';

export const ChannelSettingsModal: React.FC<ChannelSettingsModalProps> = observer(({channelId, initialMobileTab}) => {
	const {t} = useLingui();
	const channel = ChannelStore.getChannel(channelId);
	const guildId = channel?.guildId;
	const [selectedTab, setSelectedTab] = React.useState<ChannelSettingsTabType>('overview');

	const availableTabs = React.useMemo(() => {
		return getAvailableTabs(t, channelId);
	}, [t, channelId]);

	const isMobileExperience = isMobileExperienceEnabled();

	const initialTab = React.useMemo(() => {
		if (!isMobileExperience || !initialMobileTab) return;
		const targetTab = availableTabs.find((tab) => tab.type === initialMobileTab);
		if (!targetTab) return;
		return {tab: initialMobileTab, title: targetTab.label};
	}, [initialMobileTab, availableTabs, isMobileExperience]);

	const mobileNav = useMobileNavigation<ChannelSettingsTabType>(initialTab);
	const {enabled: isMobile} = MobileLayoutStore;

	React.useEffect(() => {
		if (guildId) {
			ConnectionStore.syncGuildIfNeeded(guildId, 'channel-settings-modal');
		}
	}, [guildId]);

	React.useEffect(() => {
		if (!channel) {
			ModalActionCreators.pop();
		}
	}, [channel]);

	const groupedSettingsTabs = React.useMemo(() => {
		return getGroupedSettingsTabs(availableTabs);
	}, [availableTabs]);

	const currentTab = React.useMemo(() => {
		if (!isMobile) {
			return availableTabs.find((tab) => tab.type === selectedTab);
		}
		if (mobileNav.isRootView) return;
		return availableTabs.find((tab) => tab.type === mobileNav.currentView?.tab);
	}, [isMobile, selectedTab, mobileNav.isRootView, mobileNav.currentView, availableTabs]);

	const handleMobileBack = React.useCallback(() => {
		if (mobileNav.isRootView) {
			ModalActionCreators.pop();
		} else {
			mobileNav.navigateBack();
		}
	}, [mobileNav]);

	const handleTabSelect = React.useCallback(
		(tabType: string, title: string) => {
			mobileNav.navigateTo(tabType as ChannelSettingsTabType, title);
		},
		[mobileNav],
	);

	const handleClose = React.useCallback(createHandleClose(selectedTab), [selectedTab]);

	if (!channel) {
		return null;
	}

	const isCategory = channel.type === ChannelTypes.GUILD_CATEGORY;

	return (
		<Modal.Root size="fullscreen" onClose={handleClose}>
			<Modal.ScreenReaderLabel text={isCategory ? t`Category Settings` : t`Channel Settings`} />
			<SettingsModalContainer fullscreen={true}>
				{isMobile ? (
					<MobileChannelSettingsView
						channel={channel}
						groupedSettingsTabs={groupedSettingsTabs}
						currentTab={currentTab}
						mobileNav={mobileNav}
						onBack={handleMobileBack}
						onTabSelect={handleTabSelect}
					/>
				) : (
					<DesktopChannelSettingsView
						channel={channel}
						groupedSettingsTabs={groupedSettingsTabs}
						currentTab={currentTab}
						selectedTab={selectedTab}
						onTabSelect={setSelectedTab}
					/>
				)}
			</SettingsModalContainer>
		</Modal.Root>
	);
});
