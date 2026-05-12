/*
 * SPDX-License-Identifier: AGPL-3.0-or-later
 * Copyright (C) 2020-2026 Fluxer Contributors
 * Copyright (C) 2026 Floodilka Contributors
 * Modified by Floodilka Contributors starting March 2026. See LICENSE and NOTICE.
 */

import {observer} from 'mobx-react-lite';
import React from 'react';
import {CheckboxItem} from './ContextMenu';
import styles from './ContextMenu.module.css';

interface MenuItemCheckboxProps {
	children?: React.ReactNode;
	description?: React.ReactNode;
	icon?: React.ReactNode;
	checked: boolean;
	disabled?: boolean;
	onChange?: (checked: boolean) => void;
	danger?: boolean;
	closeOnChange?: boolean;
}

export const MenuItemCheckbox: React.FC<MenuItemCheckboxProps> = observer(
	({children, description, icon, checked, disabled = false, onChange, danger = false, closeOnChange = false}) => {
		const handleCheckedChange = React.useCallback(
			(newChecked: boolean) => {
				onChange?.(newChecked);
			},
			[onChange],
		);

		return (
			<CheckboxItem
				label={children?.toString() || ''}
				icon={icon}
				checked={checked}
				disabled={disabled}
				danger={danger}
				onCheckedChange={handleCheckedChange}
				closeOnChange={closeOnChange}
			>
				<div className={styles.menuItemCheckboxLabel}>
					<span className={styles.menuItemCheckboxLabelPrimary}>{children}</span>
					{description && <span className={styles.menuItemCheckboxDescription}>{description}</span>}
				</div>
			</CheckboxItem>
		);
	},
);
