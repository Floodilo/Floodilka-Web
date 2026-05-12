/*
 * SPDX-License-Identifier: AGPL-3.0-or-later
 * Copyright (C) 2020-2026 Fluxer Contributors
 * Copyright (C) 2026 Floodilka Contributors
 * Modified by Floodilka Contributors starting March 2026. See LICENSE and NOTICE.
 */

import type {MessageDescriptor} from '@lingui/core';
import {msg, t} from '@lingui/core/macro';
import {Trans, useLingui} from '@lingui/react/macro';
import type {IconProps} from '@phosphor-icons/react';
import {
	BrowserIcon,
	CheckIcon,
	FileIcon,
	ImageIcon,
	LinkIcon,
	MusicNoteIcon,
	StickerIcon,
	VideoIcon,
} from '@phosphor-icons/react';
import {clsx} from 'clsx';
import type React from 'react';
import {BottomSheet} from '~/components/uikit/BottomSheet/BottomSheet';
import {Button} from '~/components/uikit/Button/Button';
import {Scroller} from '~/components/uikit/Scroller';
import styles from './HasFilterSheet.module.css';

export type HasFilterType = 'image' | 'sound' | 'video' | 'file' | 'sticker' | 'embed' | 'link';

interface HasFilterOption {
	type: HasFilterType;
	label: MessageDescriptor;
	icon: React.ComponentType<IconProps>;
}

const HAS_FILTER_OPTIONS: Array<HasFilterOption> = [
	{type: 'image', label: msg`Image`, icon: ImageIcon},
	{type: 'video', label: msg`Video`, icon: VideoIcon},
	{type: 'sound', label: msg`Sound`, icon: MusicNoteIcon},
	{type: 'file', label: msg`File`, icon: FileIcon},
	{type: 'link', label: msg`Link`, icon: LinkIcon},
	{type: 'embed', label: msg`Embed`, icon: BrowserIcon},
	{type: 'sticker', label: msg`Sticker`, icon: StickerIcon},
];

interface HasFilterSheetProps {
	isOpen: boolean;
	onClose: () => void;
	selectedFilters: Array<HasFilterType>;
	onFiltersChange: (filters: Array<HasFilterType>) => void;
}

export const HasFilterSheet: React.FC<HasFilterSheetProps> = ({isOpen, onClose, selectedFilters, onFiltersChange}) => {
	const {i18n} = useLingui();

	const toggleFilter = (type: HasFilterType) => {
		if (selectedFilters.includes(type)) {
			onFiltersChange(selectedFilters.filter((f) => f !== type));
		} else {
			onFiltersChange([...selectedFilters, type]);
		}
	};

	return (
		<BottomSheet
			isOpen={isOpen}
			onClose={onClose}
			snapPoints={[0, 1]}
			initialSnap={1}
			title={t(i18n)`Filter by content`}
			disablePadding
		>
			<div className={styles.container}>
				<p className={styles.subtitle}>
					<Trans>Show messages that contain:</Trans>
				</p>

				<Scroller className={styles.scroller} fade={false}>
					<div className={styles.optionsContainer}>
						{HAS_FILTER_OPTIONS.map((option) => {
							const isSelected = selectedFilters.includes(option.type);
							const Icon = option.icon;

							return (
								<button
									key={option.type}
									type="button"
									className={clsx(styles.option, isSelected && styles.optionSelected)}
									onClick={() => toggleFilter(option.type)}
								>
									<div className={styles.optionLeft}>
										<Icon
											size={22}
											className={clsx(styles.optionIcon, isSelected && styles.optionIconSelected)}
											weight="regular"
										/>
										<span className={clsx(styles.optionLabel, isSelected && styles.optionLabelSelected)}>
											{i18n._(option.label)}
										</span>
									</div>

									{isSelected && <CheckIcon size={20} className={styles.checkIcon} weight="bold" />}
								</button>
							);
						})}
					</div>
				</Scroller>

				<div className={styles.footer}>
					<Button variant="primary" onClick={onClose}>
						<Trans>Done</Trans>
					</Button>
				</div>
			</div>
		</BottomSheet>
	);
};
