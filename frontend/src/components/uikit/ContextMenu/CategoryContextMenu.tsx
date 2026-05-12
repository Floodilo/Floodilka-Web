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
	CategoryNotificationSettingsMenuItem,
	CollapseAllCategoriesMenuItem,
	CollapseCategoryMenuItem,
	CopyCategoryIdMenuItem,
	DeleteCategoryMenuItem,
	EditCategoryMenuItem,
	MarkCategoryAsReadMenuItem,
	MuteCategoryMenuItem,
} from './items/CategoryMenuItems';
import {DebugChannelMenuItem} from './items/DebugMenuItems';
import {MenuGroup} from './MenuGroup';

interface CategoryContextMenuProps {
	category: ChannelRecord;
	onClose: () => void;
}

export const CategoryContextMenu: React.FC<CategoryContextMenuProps> = observer(({category, onClose}) => {
	const canManageChannels = PermissionStore.can(Permissions.MANAGE_CHANNELS, {
		channelId: category.id,
		guildId: category.guildId,
	});
	const developerMode = UserSettingsStore.developerMode;

	return (
		<>
			<MenuGroup>
				<MarkCategoryAsReadMenuItem category={category} onClose={onClose} />
			</MenuGroup>

			<MenuGroup>
				<CollapseCategoryMenuItem category={category} onClose={onClose} />
				<CollapseAllCategoriesMenuItem category={category} onClose={onClose} />
			</MenuGroup>

			<MenuGroup>
				<MuteCategoryMenuItem category={category} onClose={onClose} />
				<CategoryNotificationSettingsMenuItem category={category} onClose={onClose} />
			</MenuGroup>

			{canManageChannels && (
				<MenuGroup>
					<EditCategoryMenuItem category={category} onClose={onClose} />
					<DeleteCategoryMenuItem category={category} onClose={onClose} />
				</MenuGroup>
			)}

			<MenuGroup>
				<CopyCategoryIdMenuItem category={category} onClose={onClose} />
				{developerMode && <DebugChannelMenuItem channel={category} onClose={onClose} />}
			</MenuGroup>
		</>
	);
});
