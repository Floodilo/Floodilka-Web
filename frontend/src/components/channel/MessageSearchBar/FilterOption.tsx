/*
 * SPDX-License-Identifier: AGPL-3.0-or-later
 * Copyright (C) 2020-2026 Fluxer Contributors
 * Copyright (C) 2026 Floodilka Contributors
 * Modified by Floodilka Contributors starting March 2026. See LICENSE and NOTICE.
 */

import {useLingui} from '@lingui/react/macro';
import {FunnelIcon, PlusIcon} from '@phosphor-icons/react';
import {observer} from 'mobx-react-lite';
import React from 'react';
import type {SearchFilterOption} from '~/utils/SearchUtils';
import styles from './MessageSearchBar.module.css';

interface FilterOptionProps {
	option: SearchFilterOption;
	index: number;
	isSelected: boolean;
	isHovered: boolean;
	onSelect: () => void;
	onMouseEnter: () => void;
	onMouseLeave?: () => void;
	listboxId: string;
}

export const FilterOption: React.FC<FilterOptionProps> = observer(
	({option, index, isSelected, isHovered, onSelect, onMouseEnter, onMouseLeave, listboxId}) => {
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
				<div className={styles.optionLabel}>
					<div className={styles.optionContent}>
						<div className={styles.optionText}>
							<span className={styles.optionTitle}>
								<span className={styles.searchFilter}>{option.label}</span>
								<span className={styles.optionDescription}> — {option.description}</span>
							</span>
						</div>
					</div>
				</div>
				<PlusIcon
					weight="bold"
					className={`${styles.optionMetaIcon} ${showIcon ? '' : styles.optionMetaIconInactive}`}
				/>
			</div>
		);
	},
);

interface FiltersSectionProps {
	options: Array<SearchFilterOption>;
	selectedIndex: number;
	hoverIndex: number;
	onSelect: (option: SearchFilterOption) => void;
	onMouseEnter: (index: number) => void;
	onMouseLeave?: () => void;
	listboxId: string;
	title?: string;
}

export const FiltersSection: React.FC<FiltersSectionProps> = observer(
	({options, selectedIndex, hoverIndex, onSelect, onMouseEnter, onMouseLeave, listboxId, title}) => {
		const {t} = useLingui();
		if (options.length === 0) return null;

		return (
			<div className={styles.popoutSection}>
				<div className={styles.popoutSectionHeader}>
					<span className={`${styles.flex} ${styles.itemsCenter} ${styles.gap2}`}>
						<FunnelIcon weight="regular" size={12} />
						{title || t`Search Filters`}
					</span>
				</div>
				{options.map((option: SearchFilterOption, index) => (
					<FilterOption
						key={option.key}
						option={option}
						index={index}
						isSelected={index === selectedIndex}
						onSelect={() => onSelect(option)}
						isHovered={index === hoverIndex}
						onMouseEnter={() => onMouseEnter(index)}
						onMouseLeave={onMouseLeave}
						listboxId={listboxId}
					/>
				))}
			</div>
		);
	},
);
