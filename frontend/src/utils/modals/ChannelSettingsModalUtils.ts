/*
 * SPDX-License-Identifier: AGPL-3.0-or-later
 * Copyright (C) 2020-2026 Fluxer Contributors
 * Copyright (C) 2026 Floodilka Contributors
 * Modified by Floodilka Contributors starting March 2026. See LICENSE and NOTICE.
 */

import type {MessageDescriptor} from '@lingui/core';
import * as ModalActionCreators from '~/actions/ModalActionCreators';
import * as UnsavedChangesActionCreators from '~/actions/UnsavedChangesActionCreators';
import {ChannelTypes} from '~/Constants';
import {
	type ChannelSettingsTab,
	type ChannelSettingsTabType,
	getChannelSettingsTabs,
} from '~/components/modals/utils/channelSettingsConstants';
import ChannelStore from '~/stores/ChannelStore';
import PermissionStore from '~/stores/PermissionStore';
import UnsavedChangesStore from '~/stores/UnsavedChangesStore';

export type {ChannelSettingsTabType};

export interface ChannelSettingsModalProps {
	channelId: string;
	initialMobileTab?: ChannelSettingsTabType;
}

export const getAvailableTabs = (
	t: (msg: MessageDescriptor) => string,
	channelId: string,
): Array<ChannelSettingsTab> => {
	const channel = ChannelStore.getChannel(channelId);
	if (!channel) return getChannelSettingsTabs(t);

	let filteredTabs = getChannelSettingsTabs(t);

	if (channel.type === ChannelTypes.GUILD_CATEGORY) {
		filteredTabs = filteredTabs.filter((tab) => tab.type === 'overview' || tab.type === 'permissions');
	}

	if (channel.type === ChannelTypes.GUILD_VOICE) {
		filteredTabs = filteredTabs.filter((tab) => tab.type !== 'webhooks');
	}

	return filteredTabs.filter((tab) => {
		if (tab.permission && !PermissionStore.can(tab.permission, {guildId: channel.guildId})) {
			return false;
		}
		return true;
	});
};

export const getGroupedSettingsTabs = (availableTabs: Array<ChannelSettingsTab>) => {
	return availableTabs.reduce(
		(acc: Record<string, Array<ChannelSettingsTab>>, tab: ChannelSettingsTab) => {
			if (!acc[tab.category]) {
				acc[tab.category] = [];
			}
			acc[tab.category].push(tab);
			return acc;
		},
		{} as Record<string, Array<ChannelSettingsTab>>,
	);
};

export const createHandleClose = (selectedTab: ChannelSettingsTabType) => {
	return () => {
		const checkTabId = selectedTab;
		if (checkTabId && UnsavedChangesStore.unsavedChanges[checkTabId]) {
			UnsavedChangesActionCreators.triggerFlashEffect(checkTabId);
			return;
		}
		ModalActionCreators.pop();
	};
};
