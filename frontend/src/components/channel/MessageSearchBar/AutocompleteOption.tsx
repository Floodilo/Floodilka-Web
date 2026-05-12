/*
 * SPDX-License-Identifier: AGPL-3.0-or-later
 * Copyright (C) 2020-2026 Fluxer Contributors
 * Copyright (C) 2026 Floodilka Contributors
 * Modified by Floodilka Contributors starting March 2026. See LICENSE and NOTICE.
 */

import {PlusIcon} from '@phosphor-icons/react';
import {observer} from 'mobx-react-lite';
import React from 'react';
import styles from './MessageSearchBar.module.css';

interface AutocompleteOptionProps {
	index: number;
	isSelected: boolean;
	isHovered: boolean;
	onSelect: () => void;
	onMouseEnter?: () => void;
	onMouseLeave?: () => void;
	children: React.ReactNode;
	listboxId: string;
}

export const AutocompleteOption: React.FC<AutocompleteOptionProps> = observer(
	({index, isSelected, isHovered, onSelect, onMouseEnter, onMouseLeave, children, listboxId}) => {
		const handleKeyDown = React.useCallback(
			(e: React.KeyboardEvent) => {
				if (e.key === 'Enter' || e.key === ' ') {
					e.preventDefault();
					onSelect();
				}
			},
			[onSelect],
		);

		const isActive = isSelected || isHovered;
		const showIcon = isSelected || isHovered;

		return (
			<div
				role="option"
				id={`${listboxId}-opt-${index}`}
				aria-selected={isSelected}
				tabIndex={isSelected ? 0 : -1}
				onMouseEnter={onMouseEnter}
				onMouseLeave={onMouseLeave}
				onMouseDown={(ev) => ev.preventDefault()}
				onClick={onSelect}
				onKeyDown={handleKeyDown}
				className={`${styles.option} ${isActive ? styles.optionActive : ''} ${isSelected ? styles.optionKeyboardFocus : ''}`}
			>
				{children}
				<PlusIcon
					weight="bold"
					className={`${styles.optionMetaIcon} ${showIcon ? '' : styles.optionMetaIconInactive}`}
				/>
			</div>
		);
	},
);
