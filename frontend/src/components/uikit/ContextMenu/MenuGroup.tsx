/*
 * SPDX-License-Identifier: AGPL-3.0-or-later
 * Copyright (C) 2020-2026 Fluxer Contributors
 * Copyright (C) 2026 Floodilka Contributors
 * Modified by Floodilka Contributors starting March 2026. See LICENSE and NOTICE.
 */

import {observer} from 'mobx-react-lite';
import React from 'react';
import {MenuGroup as MenuGroupPrimitive, MenuSeparator} from './ContextMenu';

interface MenuGroupProps {
	children?: React.ReactNode;
}

export const MenuGroup: React.FC<MenuGroupProps> = observer(({children}) => {
	const validChildren = React.Children.toArray(children).filter((child): child is React.ReactElement => {
		if (!React.isValidElement(child)) return false;
		if (child.type === React.Fragment && !(child.props as {children?: React.ReactNode}).children) return false;
		return true;
	});

	if (validChildren.length === 0) {
		return null;
	}

	return (
		<>
			<MenuGroupPrimitive>{validChildren}</MenuGroupPrimitive>
			<MenuSeparator />
		</>
	);
});
