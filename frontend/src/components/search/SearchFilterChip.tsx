/*
 * SPDX-License-Identifier: AGPL-3.0-or-later
 * Copyright (C) 2020-2026 Fluxer Contributors
 * Copyright (C) 2026 Floodilka Contributors
 * Modified by Floodilka Contributors starting March 2026. See LICENSE and NOTICE.
 */

import {useLingui} from '@lingui/react/macro';
import {XIcon} from '@phosphor-icons/react';
import {clsx} from 'clsx';
import type React from 'react';
import styles from './SearchFilterChip.module.css';

interface SearchFilterChipProps {
	label: string;
	value?: string;
	onPress?: () => void;
	onRemove?: () => void;
	isActive?: boolean;
	icon?: React.ReactNode;
}

export const SearchFilterChip: React.FC<SearchFilterChipProps> = ({
	label,
	value,
	onPress,
	onRemove,
	isActive = false,
	icon,
}) => {
	const {t} = useLingui();
	return (
		<button type="button" className={clsx(styles.chip, isActive && styles.chipActive)} onClick={onPress}>
			{icon && <span className={styles.chipIcon}>{icon}</span>}
			<span className={styles.chipContent}>
				<span className={clsx(styles.chipLabel, isActive && styles.chipLabelActive)}>{label}</span>
				{value && <span className={clsx(styles.chipValue, isActive && styles.chipValueActive)}>{value}</span>}
			</span>
			{isActive && onRemove && (
				<button
					type="button"
					className={styles.removeButton}
					onClick={(e) => {
						e.stopPropagation();
						onRemove();
					}}
					aria-label={t`Remove filter`}
				>
					<XIcon size={12} weight="bold" />
				</button>
			)}
		</button>
	);
};
