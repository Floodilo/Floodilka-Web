/*
 * SPDX-License-Identifier: AGPL-3.0-or-later
 * Copyright (C) 2020-2026 Fluxer Contributors
 * Copyright (C) 2026 Floodilka Contributors
 * Modified by Floodilka Contributors starting March 2026. See LICENSE and NOTICE.
 */

import {useLingui} from '@lingui/react/macro';
import {MagnifyingGlassIcon} from '@phosphor-icons/react';
import {DateTime} from 'luxon';
import {observer} from 'mobx-react-lite';
import type React from 'react';
import {AutocompleteOption} from './AutocompleteOption';
import styles from './MessageSearchBar.module.css';

interface DateSectionProps {
	selectedIndex: number;
	hoverIndex: number;
	onSelect: (dateValue: string) => void;
	onMouseEnter: (index: number) => void;
	onMouseLeave?: () => void;
	listboxId: string;
}

export const DateSection: React.FC<DateSectionProps> = observer(
	({selectedIndex, hoverIndex, onSelect, onMouseEnter, onMouseLeave, listboxId}) => {
		const {t} = useLingui();

		const now = DateTime.local();
		const fmt = (dt: DateTime) => dt.toFormat('yyyy-MM-dd');
		const fmtTime = (dt: DateTime) => dt.toFormat("yyyy-MM-dd'T'HH:mm");

		const options = [
			{label: 'Today', value: fmt(now)},
			{label: 'Yesterday', value: fmt(now.minus({days: 1}))},
			{label: 'Now', value: fmtTime(now)},
		];

		return (
			<div className={styles.popoutSection}>
				<div className={styles.popoutSectionHeader}>
					<span className={`${styles.flex} ${styles.itemsCenter} ${styles.gap2}`}>
						<MagnifyingGlassIcon weight="regular" size={14} />
						{t`Date Options`}
					</span>
				</div>
				{options.map((opt: {label: string; value: string}, index) => (
					<AutocompleteOption
						key={opt.label}
						index={index}
						isSelected={index === selectedIndex}
						isHovered={index === hoverIndex}
						onSelect={() => onSelect(opt.value)}
						onMouseEnter={() => onMouseEnter(index)}
						onMouseLeave={onMouseLeave}
						listboxId={listboxId}
					>
						<div className={styles.optionLabel}>
							<div className={styles.optionContent}>
								<div className={styles.optionText}>
									<div className={styles.optionTitle}>{opt.label}</div>
									<div className={styles.optionDescription}>{opt.value}</div>
								</div>
							</div>
						</div>
					</AutocompleteOption>
				))}
			</div>
		);
	},
);
