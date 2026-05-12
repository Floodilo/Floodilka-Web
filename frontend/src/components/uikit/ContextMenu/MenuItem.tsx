/*
 * SPDX-License-Identifier: AGPL-3.0-or-later
 * Copyright (C) 2020-2026 Fluxer Contributors
 * Copyright (C) 2026 Floodilka Contributors
 * Modified by Floodilka Contributors starting March 2026. See LICENSE and NOTICE.
 */

import React from 'react';
import {MenuItem as MenuItemPrimitive} from './ContextMenu';
import styles from './MenuItem.module.css';

type MenuItemPrimitiveProps = React.ComponentProps<typeof MenuItemPrimitive>;
type MenuItemSelectEvent = Parameters<NonNullable<MenuItemPrimitiveProps['onSelect']>>[0];

interface MenuItemProps {
	children?: React.ReactNode;
	icon?: React.ReactNode;
	danger?: boolean;
	disabled?: boolean;
	onClick?: ((event: MenuItemSelectEvent) => void) | (() => void);
	hint?: string;
	shortcut?: string;
	className?: string;
	closeOnSelect?: boolean;
}

export const MenuItem = React.forwardRef<HTMLDivElement, MenuItemProps>(
	(
		{children, icon, danger = false, disabled = false, onClick, hint, shortcut, className, closeOnSelect = true},
		ref,
	) => {
		const handleSelect = React.useCallback(
			(event: MenuItemSelectEvent) => {
				if (!onClick) return;
				if (onClick.length === 0) {
					(onClick as () => void)();
					return;
				}
				(onClick as (event: MenuItemSelectEvent) => void)(event);
			},
			[onClick],
		);

		const combinedClassName =
			`${styles.menuItem} ${danger ? styles.danger : ''} ${disabled ? styles.disabled : ''} ${className ?? ''}`.trim();

		return (
			<MenuItemPrimitive
				ref={ref}
				label=""
				className={combinedClassName}
				disabled={disabled}
				onSelect={handleSelect}
				danger={danger}
				icon={icon}
				closeOnSelect={closeOnSelect}
			>
				<div className={styles.labelContainer}>
					<span className={styles.label}>{children}</span>
					{hint && <div className={styles.subtext}>{hint}</div>}
				</div>
				{shortcut && <span className={styles.shortcut}>{shortcut}</span>}
			</MenuItemPrimitive>
		);
	},
);
