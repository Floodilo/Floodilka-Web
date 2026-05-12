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
import * as UnsavedChangesActionCreators from '~/actions/UnsavedChangesActionCreators';
import * as Modal from '~/components/modals/Modal';
import GuildSettingsModalStore from '~/stores/GuildSettingsModalStore';
import GuildStore from '~/stores/GuildStore';
import ConnectionStore from '~/stores/gateway/ConnectionStore';
import MobileLayoutStore from '~/stores/MobileLayoutStore';
import PermissionStore from '~/stores/PermissionStore';
import UnsavedChangesStore from '~/stores/UnsavedChangesStore';
import {isMobileExperienceEnabled} from '~/utils/mobileExperience';
import {DesktopGuildSettingsView} from './components/DesktopGuildSettingsView';
import {MobileGuildSettingsView} from './components/MobileGuildSettingsView';
import {useMobileNavigation} from './hooks/useMobileNavigation';
import {SettingsModalContainer} from './shared/SettingsModalLayout';
import {type GuildSettingsTabType, getGuildSettingsTabs} from './utils/guildSettingsConstants';

interface GuildSettingsModalProps {
	guildId: string;
	initialTab?: GuildSettingsTabType;
	initialMobileTab?: GuildSettingsTabType;
}

export const GuildSettingsModal: React.FC<GuildSettingsModalProps> = observer(
	({guildId, initialTab: initialTabProp, initialMobileTab}) => {
		const {t} = useLingui();
		const guild = GuildStore.getGuild(guildId);
		const [selectedTab, setSelectedTab] = React.useState<GuildSettingsTabType>(initialTabProp ?? 'overview');

		const availableTabs = React.useMemo(() => {
			const guildSettingsTabs = getGuildSettingsTabs(t);
			if (!guild) return guildSettingsTabs;

			return guildSettingsTabs.filter((tab) => {
				if (tab.permission && !PermissionStore.can(tab.permission, {guildId})) {
					return false;
				}
				if (tab.requireFeature && !guild.features.has(tab.requireFeature)) {
					return false;
				}
				return true;
			});
		}, [guild, guildId, t]);

		const isMobileExperience = isMobileExperienceEnabled();

		const initialMobileTabObject = React.useMemo(() => {
			if (!isMobileExperience || !initialMobileTab) return;
			const targetTab = availableTabs.find((tab) => tab.type === initialMobileTab);
			if (!targetTab) return;
			return {tab: initialMobileTab, title: targetTab.label};
		}, [initialMobileTab, availableTabs, isMobileExperience]);

		const mobileNav = useMobileNavigation<GuildSettingsTabType>(initialMobileTabObject);
		const mobileNavigateTo = mobileNav.navigateTo;
		const mobileResetToRoot = mobileNav.resetToRoot;
		const mobileIsRootView = mobileNav.isRootView;
		const {enabled: isMobile} = MobileLayoutStore;

		const unsavedChangesStore = UnsavedChangesStore;

		React.useEffect(() => {
			ConnectionStore.syncGuildIfNeeded(guildId, 'guild-settings-modal');
		}, [guildId]);

		React.useEffect(() => {
			if (!guild) {
				ModalActionCreators.pop();
			}
		}, [guild]);

		React.useEffect(() => {
			if (availableTabs.length > 0 && !availableTabs.find((tab) => tab.type === selectedTab)) {
				setSelectedTab(availableTabs[0].type);
			}
		}, [availableTabs, selectedTab]);

		const groupedSettingsTabs = React.useMemo(() => {
			return availableTabs.reduce(
				(acc, tab) => {
					if (!acc[tab.category]) {
						acc[tab.category] = [];
					}
					acc[tab.category].push(tab);
					return acc;
				},
				{} as Record<string, Array<(typeof availableTabs)[number]>>,
			);
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
				mobileNav.navigateTo(tabType as GuildSettingsTabType, title);
			},
			[mobileNav],
		);

		const handleClose = React.useCallback(() => {
			const checkTabId = selectedTab;
			if (checkTabId && unsavedChangesStore.unsavedChanges[checkTabId]) {
				UnsavedChangesActionCreators.triggerFlashEffect(checkTabId);
				return;
			}
			ModalActionCreators.pop();
		}, [selectedTab, unsavedChangesStore.unsavedChanges]);

		const handleExternalNavigate = React.useCallback(
			(targetTab: GuildSettingsTabType) => {
				const tabMeta = availableTabs.find((tab) => tab.type === targetTab);
				if (!tabMeta) return;
				if (isMobile) {
					if (!mobileIsRootView) {
						mobileResetToRoot();
					}
					mobileNavigateTo(tabMeta.type, tabMeta.label);
				} else {
					setSelectedTab(tabMeta.type);
				}
			},
			[availableTabs, isMobile, mobileIsRootView, mobileNavigateTo, mobileResetToRoot],
		);

		React.useEffect(() => {
			GuildSettingsModalStore.register({guildId, navigate: handleExternalNavigate});
			return () => {
				GuildSettingsModalStore.unregister(guildId);
			};
		}, [guildId, handleExternalNavigate]);

		if (!guild) {
			return null;
		}

		return (
			<Modal.Root size="fullscreen" onClose={handleClose}>
				<Modal.ScreenReaderLabel text={t`Community Settings`} />
				<SettingsModalContainer fullscreen={true}>
					{isMobile ? (
						<MobileGuildSettingsView
							guild={guild}
							groupedSettingsTabs={groupedSettingsTabs}
							currentTab={currentTab}
							mobileNav={mobileNav}
							onBack={handleMobileBack}
							onTabSelect={handleTabSelect}
						/>
					) : (
						<DesktopGuildSettingsView
							guild={guild}
							groupedSettingsTabs={groupedSettingsTabs}
							currentTab={currentTab}
							selectedTab={selectedTab}
							onTabSelect={setSelectedTab}
						/>
					)}
				</SettingsModalContainer>
			</Modal.Root>
		);
	},
);
