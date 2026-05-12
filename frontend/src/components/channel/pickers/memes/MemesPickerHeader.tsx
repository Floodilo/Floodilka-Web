/*
 * SPDX-License-Identifier: AGPL-3.0-or-later
 * Copyright (C) 2020-2026 Fluxer Contributors
 * Copyright (C) 2026 Floodilka Contributors
 * Modified by Floodilka Contributors starting March 2026. See LICENSE and NOTICE.
 */

import {useLingui} from '@lingui/react/macro';
import {GifIcon, ImageIcon, MusicNoteIcon, VideoCameraIcon} from '@phosphor-icons/react';
import {clsx} from 'clsx';
import type React from 'react';
import styles from '~/components/channel/MemesPicker.module.css';
import {PickerSearchInput} from '~/components/channel/shared/PickerSearchInput';

export type ContentType = 'all' | 'image' | 'video' | 'audio' | 'gif';

interface FilterOption {
	type: ContentType;
	label: string;
	icon?: React.ReactNode;
}

export function MemesPickerHeader({
	searchTerm,
	onSearchTermChange,
	onClearSearch,
	selectedFilter,
	onFilterChange,
	inputRef,
}: {
	searchTerm: string;
	onSearchTermChange: (value: string) => void;
	onClearSearch: () => void;
	selectedFilter: ContentType;
	onFilterChange: (filter: ContentType) => void;
	inputRef: React.RefObject<HTMLInputElement | null> | React.RefObject<HTMLInputElement>;
}) {
	const {t} = useLingui();

	const FILTER_OPTIONS: Array<FilterOption> = [
		{type: 'all', label: t`All`},
		{type: 'image', label: t`Images`, icon: <ImageIcon className={styles.filterPillIcon} />},
		{type: 'video', label: t`Videos`, icon: <VideoCameraIcon className={styles.filterPillIcon} />},
		{type: 'audio', label: t`Audio`, icon: <MusicNoteIcon className={styles.filterPillIcon} />},
		{type: 'gif', label: t`GIFs`, icon: <GifIcon className={styles.filterPillIcon} />},
	];

	return (
		<div className={styles.headerContainer}>
			<PickerSearchInput
				value={searchTerm}
				onChange={onSearchTermChange}
				placeholder={t`Search saved media`}
				inputRef={inputRef}
				showBackButton={Boolean(searchTerm)}
				onBackButtonClick={onClearSearch}
			/>

			<div className={styles.filterList}>
				{FILTER_OPTIONS.map((option) => {
					const isActive = selectedFilter === option.type;
					return (
						<button
							key={option.type}
							type="button"
							onClick={() => onFilterChange(option.type)}
							className={clsx(styles.filterPill, isActive && styles.filterPillActive)}
						>
							{option.icon}
							{option.label}
						</button>
					);
				})}
			</div>
		</div>
	);
}
