/*
 * SPDX-License-Identifier: AGPL-3.0-or-later
 * Copyright (C) 2020-2026 Fluxer Contributors
 * Copyright (C) 2026 Floodilka Contributors
 * Modified by Floodilka Contributors starting March 2026. See LICENSE and NOTICE.
 */

import {observer} from 'mobx-react-lite';
import type React from 'react';
import {SubMenu} from './ContextMenu';

interface MenuItemSubmenuProps {
	label: string;
	icon?: React.ReactNode;
	disabled?: boolean;
	hint?: string;
	render: () => React.ReactNode;
	onTriggerSelect?: () => void;
	selectionMode?: 'none' | 'single' | 'multiple';
}

export const MenuItemSubmenu: React.FC<MenuItemSubmenuProps> = observer(
	({label, icon, disabled = false, hint, render, onTriggerSelect, selectionMode}) => {
		return (
			<SubMenu
				label={label}
				icon={icon}
				disabled={disabled}
				hint={hint}
				onTriggerSelect={onTriggerSelect}
				selectionMode={selectionMode}
			>
				{render()}
			</SubMenu>
		);
	},
);
