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
import {ComponentDispatch} from '~/lib/ComponentDispatch';
import DeveloperModeStore from '~/stores/DeveloperModeStore';
import FeatureFlagStore from '~/stores/FeatureFlagStore';
import MobileLayoutStore from '~/stores/MobileLayoutStore';
import SelectedGuildStore from '~/stores/SelectedGuildStore';
import UnsavedChangesStore from '~/stores/UnsavedChangesStore';
import {isMobileExperienceEnabled} from '~/utils/mobileExperience';
import {DesktopSettingsView} from './components/DesktopSettingsView';
import {MobileSettingsView} from './components/MobileSettingsView';
import {useMobileNavigation} from './hooks/useMobileNavigation';
import {SettingsContentKeyProvider} from './hooks/useSettingsContentKey';
import {SettingsModalContainer} from './shared/SettingsModalLayout';
import type {UserSettingsSubtabType, UserSettingsTabType} from './utils/settingsConstants';
import {getSettingsTabs} from './utils/settingsConstants';

interface UserSettingsModalProps {
	initialTab?: UserSettingsTabType;
	initialSubtab?: UserSettingsSubtabType;
	initialGuildId?: string;
}

export const UserSettingsModal: React.FC<UserSettingsModalProps> = observer(
	({initialTab, initialSubtab, initialGuildId}) => {
		const {t} = useLingui();
		const [selectedTab, setSelectedTab] = React.useState<UserSettingsTabType>(initialTab || 'my_profile');

		const isMobileExperience = isMobileExperienceEnabled();

		const settingsTabs = React.useMemo(() => getSettingsTabs(t), [t]);

		const mobileInitialTab = React.useMemo(() => {
			if (!isMobileExperience || !initialTab) return;
			const targetTab = settingsTabs.find((tab) => tab.type === initialTab);
			if (!targetTab) return;
			return {tab: initialTab, title: targetTab.label};
		}, [initialTab, isMobileExperience, settingsTabs]);

		const mobileNav = useMobileNavigation(mobileInitialTab);
		const {enabled: isMobile} = MobileLayoutStore;

		const unsavedChangesStore = UnsavedChangesStore;
		const isDeveloper = DeveloperModeStore.isDeveloper;
		const selectedGuildId = SelectedGuildStore.selectedGuildId;
		const hasExpressionPackAccess = FeatureFlagStore.isExpressionPacksEnabled(selectedGuildId ?? undefined);

		const groupedSettingsTabs = React.useMemo(() => {
			const tabsToGroup = settingsTabs.filter((tab) => {
				if (!isDeveloper && tab.category === 'staff_only') {
					return false;
				}
				if (!hasExpressionPackAccess && tab.type === 'expression_packs') {
					return false;
				}
				return true;
			});

			return tabsToGroup.reduce(
				(acc, tab) => {
					if (!acc[tab.category]) {
						acc[tab.category] = [];
					}
					acc[tab.category].push(tab);
					return acc;
				},
				{} as Record<string, Array<(typeof settingsTabs)[number]>>,
			);
		}, [isDeveloper, hasExpressionPackAccess, settingsTabs]);

		const currentTab = React.useMemo(() => {
			if (!isMobile) {
				return settingsTabs.find((tab) => tab.type === selectedTab);
			}
			if (mobileNav.isRootView) return;
			return settingsTabs.find((tab) => tab.type === mobileNav.currentView?.tab);
		}, [isMobile, selectedTab, mobileNav.isRootView, mobileNav.currentView, settingsTabs]);

		const handleMobileBack = React.useCallback(() => {
			if (mobileNav.isRootView) {
				ModalActionCreators.pop();
			} else {
				mobileNav.navigateBack();
			}
		}, [mobileNav]);

		const handleTabSelect = React.useCallback(
			(tabType: string, title: string) => {
				mobileNav.navigateTo(tabType as any, title);
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

		React.useEffect(() => {
			if (!hasExpressionPackAccess && selectedTab === 'expression_packs') {
				setSelectedTab('my_profile');
			}
		}, [hasExpressionPackAccess, selectedTab]);

		React.useEffect(() => {
			const unsubscribe = ComponentDispatch.subscribe('USER_SETTINGS_TAB_SELECT', (args?: any) => {
				const {tab} = args || {};
				if (tab && typeof tab === 'string') {
					if (isMobile) {
						const targetTab = settingsTabs.find((t) => t.type === tab);
						if (targetTab) {
							mobileNav.navigateTo(tab as UserSettingsTabType, targetTab.label);
						}
					} else {
						setSelectedTab(tab as UserSettingsTabType);
					}
				}
			});

			return unsubscribe;
		}, [isMobile, mobileNav, settingsTabs]);

		return (
			<SettingsContentKeyProvider>
				<Modal.Root size="fullscreen" onClose={handleClose}>
					<Modal.ScreenReaderLabel text={t`User Settings`} />
					<SettingsModalContainer fullscreen={true}>
						{isMobile ? (
							<MobileSettingsView
								groupedSettingsTabs={groupedSettingsTabs}
								currentTab={currentTab}
								mobileNav={mobileNav}
								onBack={handleMobileBack}
								onTabSelect={handleTabSelect}
								initialGuildId={initialGuildId}
								initialSubtab={initialSubtab}
							/>
						) : (
							<DesktopSettingsView
								groupedSettingsTabs={groupedSettingsTabs}
								currentTab={currentTab}
								selectedTab={selectedTab}
								onTabSelect={setSelectedTab}
								initialGuildId={initialGuildId}
								initialSubtab={initialSubtab}
							/>
						)}
					</SettingsModalContainer>
				</Modal.Root>
			</SettingsContentKeyProvider>
		);
	},
);
