/*
 * SPDX-License-Identifier: AGPL-3.0-or-later
 * Copyright (C) 2020-2026 Fluxer Contributors
 * Copyright (C) 2026 Floodilka Contributors
 * Modified by Floodilka Contributors starting March 2026. See LICENSE and NOTICE.
 */

import {clsx} from 'clsx';
import React from 'react';
import {Scroller} from '~/components/uikit/Scroller';
import styles from './Tabs.module.css';

export interface TabItem<T extends string> {
	key: T;
	label: string | React.ReactNode;
}

export interface TabsProps<T extends string> {
	tabs: Array<TabItem<T>>;
	activeTab: T;
	onTabChange: (tab: T) => void;
	className?: string;
	renderTabSibling?: (tab: T) => React.ReactNode;
}

export function Tabs<T extends string>({tabs, activeTab, onTabChange, className, renderTabSibling}: TabsProps<T>) {
	const tabRefs = React.useRef<Map<T, HTMLButtonElement>>(new Map());

	const focusTab = (key: T) => {
		tabRefs.current.get(key)?.focus();
	};

	const getNextKey = (currentKey: T, direction: 'next' | 'prev' | 'first' | 'last'): T => {
		const currentIndex = tabs.findIndex((tab) => tab.key === currentKey);
		switch (direction) {
			case 'next':
				return tabs[(currentIndex + 1) % tabs.length].key;
			case 'prev':
				return tabs[(currentIndex - 1 + tabs.length) % tabs.length].key;
			case 'first':
				return tabs[0].key;
			case 'last':
				return tabs[tabs.length - 1].key;
		}
	};

	const handleKeyDown = (event: React.KeyboardEvent, tabKey: T) => {
		let nextKey: T | null = null;

		switch (event.key) {
			case 'ArrowLeft':
				nextKey = getNextKey(tabKey, 'prev');
				break;
			case 'ArrowRight':
				nextKey = getNextKey(tabKey, 'next');
				break;
			case 'Home':
				nextKey = getNextKey(tabKey, 'first');
				break;
			case 'End':
				nextKey = getNextKey(tabKey, 'last');
				break;
			default:
				return;
		}

		event.preventDefault();
		onTabChange(nextKey);
		focusTab(nextKey);
	};

	return (
		<Scroller orientation="horizontal" fade key="tabs-horizontal-scroller">
			<div role="tablist" aria-orientation="horizontal" className={clsx(styles.container, className)}>
				{tabs.map(({key, label}) => {
					const isSelected = key === activeTab;
					const sibling = renderTabSibling?.(key);
					return (
						<React.Fragment key={key}>
							<button
								ref={(el) => {
									if (el) {
										tabRefs.current.set(key, el);
									} else {
										tabRefs.current.delete(key);
									}
								}}
								type="button"
								role="tab"
								aria-selected={isSelected}
								tabIndex={isSelected ? 0 : -1}
								className={clsx(styles.tab, isSelected && styles.selected)}
								onClick={() => onTabChange(key)}
								onKeyDown={(e) => handleKeyDown(e, key)}
							>
								{label}
							</button>
							{sibling}
						</React.Fragment>
					);
				})}
			</div>
		</Scroller>
	);
}
