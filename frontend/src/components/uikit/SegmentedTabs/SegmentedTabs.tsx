/*
 * SPDX-License-Identifier: AGPL-3.0-or-later
 * Copyright (C) 2020-2026 Fluxer Contributors
 * Copyright (C) 2026 Floodilka Contributors
 * Modified by Floodilka Contributors starting March 2026. See LICENSE and NOTICE.
 */

import {clsx} from 'clsx';
import {motion} from 'framer-motion';
import styles from './SegmentedTabs.module.css';

export type SegmentedTab<T extends string = string> = {
	id: T;
	label: string;
};

type SegmentedTabsProps<T extends string = string> = {
	tabs: Array<SegmentedTab<T>>;
	selectedTab: T;
	onTabChange: (tab: T) => void;
	ariaLabel?: string;
	className?: string;
};

export function SegmentedTabs<T extends string = string>({
	tabs,
	selectedTab,
	onTabChange,
	ariaLabel,
	className,
}: SegmentedTabsProps<T>) {
	const selectedIndex = tabs.findIndex((tab) => tab.id === selectedTab);

	return (
		<div className={clsx(styles.container, className)}>
			<div className={styles.tabList} role="tablist" aria-label={ariaLabel}>
				{tabs.map((tab) => (
					<button
						key={tab.id}
						type="button"
						role="tab"
						aria-selected={selectedTab === tab.id}
						onClick={() => onTabChange(tab.id)}
						className={clsx(styles.tab, selectedTab === tab.id ? styles.tabActive : styles.tabInactive)}
					>
						{tab.label}
					</button>
				))}
				<motion.div
					className={styles.tabBackground}
					layout
					transition={{
						type: 'spring',
						stiffness: 500,
						damping: 35,
					}}
					style={{
						width: `calc((100% - 6px) / ${tabs.length})`,
						left: `calc(3px + (100% - 6px) * ${selectedIndex} / ${tabs.length})`,
					}}
				/>
			</div>
		</div>
	);
}
