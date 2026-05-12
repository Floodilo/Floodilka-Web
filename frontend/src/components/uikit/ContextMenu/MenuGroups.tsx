/*
 * SPDX-License-Identifier: AGPL-3.0-or-later
 * Copyright (C) 2020-2026 Fluxer Contributors
 * Copyright (C) 2026 Floodilka Contributors
 * Modified by Floodilka Contributors starting March 2026. See LICENSE and NOTICE.
 */

import {observer} from 'mobx-react-lite';
import React from 'react';
import {MenuSeparator} from './ContextMenu';
import {MenuGroup} from './MenuGroup';

interface MenuGroupsProps {
	children?: React.ReactNode;
}

export const MenuGroups: React.FC<MenuGroupsProps> = observer(({children}) => {
	const groups = React.Children.toArray(children).filter((child) => {
		if (!child) return false;
		if (!React.isValidElement(child)) return false;
		return child.type === MenuGroup;
	});

	if (groups.length === 0) {
		return null;
	}

	return (
		<>
			{groups.map((group, index) => (
				<React.Fragment key={index}>
					{group}
					{index < groups.length - 1 && <MenuSeparator />}
				</React.Fragment>
			))}
		</>
	);
});
