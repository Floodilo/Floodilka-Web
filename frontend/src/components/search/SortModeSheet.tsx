/*
 * SPDX-License-Identifier: AGPL-3.0-or-later
 * Copyright (C) 2020-2026 Fluxer Contributors
 * Copyright (C) 2026 Floodilka Contributors
 * Modified by Floodilka Contributors starting March 2026. See LICENSE and NOTICE.
 */

import type {MessageDescriptor} from '@lingui/core';
import {msg} from '@lingui/core/macro';
import {useLingui} from '@lingui/react/macro';
import type {IconProps} from '@phosphor-icons/react';
import {CheckIcon, ClockClockwiseIcon, ClockCounterClockwiseIcon, SparkleIcon} from '@phosphor-icons/react';
import {clsx} from 'clsx';
import type React from 'react';
import {BottomSheet} from '~/components/uikit/BottomSheet/BottomSheet';
import type {ChannelSearchSortMode} from '~/hooks/useChannelSearch';
import styles from './SortModeSheet.module.css';

interface SortOption {
	mode: ChannelSearchSortMode;
	label: MessageDescriptor;
	description: MessageDescriptor;
	icon: React.ComponentType<IconProps>;
}

const SORT_OPTIONS: Array<SortOption> = [
	{
		mode: 'newest',
		label: msg`Newest First`,
		description: msg`Show most recent messages first`,
		icon: ClockClockwiseIcon,
	},
	{
		mode: 'oldest',
		label: msg`Oldest First`,
		description: msg`Show oldest messages first`,
		icon: ClockCounterClockwiseIcon,
	},
	{
		mode: 'relevant',
		label: msg`Most Relevant`,
		description: msg`Show most relevant messages first`,
		icon: SparkleIcon,
	},
];

interface SortModeSheetProps {
	isOpen: boolean;
	onClose: () => void;
	selectedMode: ChannelSearchSortMode;
	onModeChange: (mode: ChannelSearchSortMode) => void;
}

export const SortModeSheet: React.FC<SortModeSheetProps> = ({isOpen, onClose, selectedMode, onModeChange}) => {
	const {i18n} = useLingui();

	const handleSelect = (mode: ChannelSearchSortMode) => {
		onModeChange(mode);
		onClose();
	};

	return (
		<BottomSheet
			isOpen={isOpen}
			onClose={onClose}
			snapPoints={[0, 1]}
			initialSnap={1}
			title={i18n._(msg`Sort results by`)}
			disablePadding
		>
			<div className={styles.container}>
				<div className={styles.optionsContainer}>
					{SORT_OPTIONS.map((option) => {
						const isSelected = selectedMode === option.mode;
						const Icon = option.icon;

						return (
							<button
								key={option.mode}
								type="button"
								className={clsx(styles.option, isSelected && styles.optionSelected)}
								onClick={() => handleSelect(option.mode)}
							>
								<div className={styles.optionLeft}>
									<Icon
										size={22}
										className={clsx(styles.optionIcon, isSelected && styles.optionIconSelected)}
										weight="regular"
									/>
									<div className={styles.optionText}>
										<span className={clsx(styles.optionLabel, isSelected && styles.optionLabelSelected)}>
											{i18n._(option.label)}
										</span>
										<span className={styles.optionDescription}>{i18n._(option.description)}</span>
									</div>
								</div>
								{isSelected && <CheckIcon size={20} className={styles.checkIcon} weight="bold" />}
							</button>
						);
					})}
				</div>
			</div>
		</BottomSheet>
	);
};
