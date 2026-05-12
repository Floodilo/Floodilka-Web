/*
 * SPDX-License-Identifier: AGPL-3.0-or-later
 * Copyright (C) 2020-2026 Fluxer Contributors
 * Copyright (C) 2026 Floodilka Contributors
 * Modified by Floodilka Contributors starting March 2026. See LICENSE and NOTICE.
 */

import React from 'react';
import {MenuItem as AriaMenuItem} from 'react-aria-components';
import {useContextMenuClose} from './ContextMenu';
import styles from './ContextMenu.module.css';
import radioStyles from './MenuItemRadio.module.css';

interface MenuItemRadioProps {
	children?: React.ReactNode;
	icon?: React.ReactNode;
	selected: boolean;
	disabled?: boolean;
	onSelect?: () => void;
	closeOnSelect?: boolean;
}

export const MenuItemRadio = React.forwardRef<HTMLDivElement, MenuItemRadioProps>(
	({children, icon, selected, disabled = false, onSelect, closeOnSelect = false}, forwardedRef) => {
		const closeMenu = useContextMenuClose();

		const handleAction = React.useCallback(() => {
			if (disabled) return;
			onSelect?.();
			if (closeOnSelect) {
				closeMenu();
			}
		}, [closeMenu, closeOnSelect, disabled, onSelect]);

		return (
			<AriaMenuItem
				ref={forwardedRef}
				onAction={handleAction}
				isDisabled={disabled}
				className={`${styles.item} ${styles.checkboxItem} ${disabled ? styles.disabled : ''}`.trim()}
				textValue={typeof children === 'string' ? children : ''}
			>
				{icon && <div className={styles.itemIcon}>{icon}</div>}
				<div className={styles.itemLabel}>{children}</div>
				<div className={styles.checkboxIndicator}>
					<div
						className={`${radioStyles.radioButton} ${selected ? radioStyles.radioButtonSelected : radioStyles.radioButtonUnselected}`}
					>
						{selected && <div className={radioStyles.radioIndicator} />}
					</div>
				</div>
			</AriaMenuItem>
		);
	},
);

MenuItemRadio.displayName = 'MenuItemRadio';
