/*
 * SPDX-License-Identifier: AGPL-3.0-or-later
 * Copyright (C) 2020-2026 Fluxer Contributors
 * Copyright (C) 2026 Floodilka Contributors
 * Modified by Floodilka Contributors starting March 2026. See LICENSE and NOTICE.
 */

import type {Icon, IconWeight} from '@phosphor-icons/react';
import React from 'react';

export interface SettingsModalContextValue {
	fullscreen: boolean;
}

export interface SidebarCategoryContextValue {
	setTitleId: (id: string | null) => void;
}

export interface SidebarTablistContextValue {
	hasSelectedTabInView: boolean;
}

export interface SettingsModalSidebarItemProps {
	label: React.ReactNode;
	icon: Icon;
	iconWeight?: IconWeight;
	selected?: boolean;
	danger?: boolean;
	onClick?: () => void;
	onKeyDown?: (event: React.KeyboardEvent<HTMLButtonElement>) => void;
	onRequestContentFocus?: () => void;
	id?: string;
	controlsId?: string;
}

export interface SettingsModalSidebarItemLogicState {
	tabIndex: number;
	handleKeyDown: (event: React.KeyboardEvent<HTMLButtonElement>) => void;
}

export const useWidescreenMode = (): boolean => {
	const [isWidescreenMode, setIsWidescreenMode] = React.useState(
		() => window.matchMedia('(min-width: 2000px)').matches,
	);

	React.useEffect(() => {
		const mediaQuery = window.matchMedia('(min-width: 2000px)');
		const handleChange = (e: MediaQueryListEvent | MediaQueryList) => {
			setIsWidescreenMode(e.matches);
		};

		handleChange(mediaQuery);

		mediaQuery.addEventListener('change', handleChange);
		return () => mediaQuery.removeEventListener('change', handleChange);
	}, []);

	return isWidescreenMode;
};

const TABLIST_SELECTOR = '[data-settings-tablist]';
const TAB_SELECTOR = '[data-settings-tab="true"]';

const getTabsWithinList = (current: HTMLElement): Array<HTMLButtonElement> => {
	const tablist = current.closest<HTMLElement>(TABLIST_SELECTOR);
	if (!tablist) return [];
	return Array.from(tablist.querySelectorAll<HTMLButtonElement>(TAB_SELECTOR));
};

const focusRelativeTab = (current: HTMLButtonElement, offset: number) => {
	const tabs = getTabsWithinList(current);
	if (!tabs.length) return;
	const currentIndex = tabs.indexOf(current);
	if (currentIndex === -1) return;
	const nextIndex = (currentIndex + offset + tabs.length) % tabs.length;
	tabs[nextIndex]?.focus();
};

const focusEdgeTab = (current: HTMLButtonElement, edge: 'first' | 'last') => {
	const tabs = getTabsWithinList(current);
	if (!tabs.length) return;
	const target = edge === 'first' ? tabs[0] : tabs[tabs.length - 1];
	target?.focus();
};

export const useSettingsModalSidebarItemLogic = ({
	selected,
	onClick,
	onKeyDown,
	onRequestContentFocus,
	hasSelectedTabInView,
}: Pick<SettingsModalSidebarItemProps, 'selected' | 'onClick' | 'onKeyDown' | 'onRequestContentFocus'> & {
	hasSelectedTabInView: boolean;
}): SettingsModalSidebarItemLogicState => {
	const ref = React.useRef<HTMLButtonElement>(null);

	React.useEffect(() => {
		if (selected) {
			ref.current?.scrollIntoView({block: 'nearest'});
		}
	}, [selected]);

	const tabIndex = React.useMemo(() => {
		if (!hasSelectedTabInView) return 0;
		return selected ? 0 : -1;
	}, [hasSelectedTabInView, selected]);

	const handleKeyDown = React.useCallback(
		(event: React.KeyboardEvent<HTMLButtonElement>) => {
			if (event.defaultPrevented) {
				onKeyDown?.(event);
				return;
			}

			switch (event.key) {
				case 'ArrowDown':
				case 'ArrowRight':
					focusRelativeTab(event.currentTarget, 1);
					event.preventDefault();
					break;
				case 'ArrowUp':
				case 'ArrowLeft':
					focusRelativeTab(event.currentTarget, -1);
					event.preventDefault();
					break;
				case 'Home':
					focusEdgeTab(event.currentTarget, 'first');
					event.preventDefault();
					break;
				case 'End':
					focusEdgeTab(event.currentTarget, 'last');
					event.preventDefault();
					break;
				case 'Enter':
				case ' ': {
					onClick?.();
					onRequestContentFocus?.();
					event.preventDefault();
					break;
				}
				default:
					break;
			}

			onKeyDown?.(event);
		},
		[onClick, onKeyDown, onRequestContentFocus],
	);

	return {
		tabIndex,
		handleKeyDown,
	};
};

export const useTrafficLightsVisibility = (fullscreen: boolean, isWidescreenMode: boolean): boolean => {
	return React.useMemo(() => {
		return fullscreen && !isWidescreenMode;
	}, [fullscreen, isWidescreenMode]);
};
