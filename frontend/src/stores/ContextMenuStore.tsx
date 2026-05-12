/*
 * SPDX-License-Identifier: AGPL-3.0-or-later
 * Copyright (C) 2020-2026 Fluxer Contributors
 * Copyright (C) 2026 Floodilka Contributors
 * Modified by Floodilka Contributors starting March 2026. See LICENSE and NOTICE.
 */

import {makeAutoObservable} from 'mobx';
import {Logger} from '~/lib/Logger';
import KeyboardModeStore from './KeyboardModeStore';

const logger = new Logger('ContextMenuStore');

export interface FocusableContextMenuTarget {
	tagName: string;
	isConnected: boolean;
	focus: (options?: FocusOptions) => void;
	addEventListener: HTMLElement['addEventListener'];
	removeEventListener: HTMLElement['removeEventListener'];
}

export type ContextMenuTargetElement = HTMLElement | FocusableContextMenuTarget;

export const isContextMenuNodeTarget = (target: ContextMenuTargetElement | null | undefined): target is HTMLElement => {
	if (!target || typeof Node === 'undefined') {
		return false;
	}
	return target instanceof HTMLElement;
};

export interface ContextMenuTarget {
	x: number;
	y: number;
	target: ContextMenuTargetElement;
}

export interface ContextMenuConfig {
	onClose?: () => void;
	noBlurEvent?: boolean;
	returnFocus?: boolean;
	returnFocusTarget?: ContextMenuTargetElement | null;
	align?: 'top-left' | 'top-right';
}

export interface ContextMenu {
	id: string;
	target: ContextMenuTarget;
	render: (props: {onClose: () => void}) => React.ReactNode;
	config?: ContextMenuConfig;
}

export interface FocusRestoreState {
	target: ContextMenuTargetElement | null;
	keyboardModeEnabled: boolean;
}

class ContextMenuStore {
	contextMenu: ContextMenu | null = null;
	private focusRestoreState: FocusRestoreState | null = null;

	constructor() {
		makeAutoObservable(this, {}, {autoBind: true});
	}

	open(contextMenu: ContextMenu): void {
		logger.debug(`Opening context menu: ${contextMenu.id}`);
		this.contextMenu = contextMenu;
		const requestedTarget = contextMenu.config?.returnFocusTarget ?? contextMenu.target.target;
		this.focusRestoreState = {
			target: requestedTarget ?? null,
			keyboardModeEnabled: KeyboardModeStore.keyboardModeEnabled,
		};
	}

	close(): void {
		if (this.contextMenu) {
			logger.debug(`Closing context menu: ${this.contextMenu.id}`);
			const {config, target} = this.contextMenu;
			const shouldReturnFocus = config?.returnFocus ?? true;
			const fallbackTarget = target.target;
			const restoreState = shouldReturnFocus ? this.focusRestoreState : null;
			const focusTarget = config?.returnFocusTarget ?? restoreState?.target ?? fallbackTarget ?? null;
			const resumeKeyboardMode = Boolean(restoreState?.keyboardModeEnabled);
			config?.onClose?.();
			this.contextMenu = null;
			this.focusRestoreState = null;
			if (shouldReturnFocus) {
				this.restoreFocus(focusTarget, resumeKeyboardMode);
			}
		}
	}

	private restoreFocus(target: ContextMenuTargetElement | null, resumeKeyboardMode: boolean): void {
		logger.debug(
			`ContextMenuStore.restoreFocus target=${target ? target.tagName : 'null'} resumeKeyboardMode=${resumeKeyboardMode}`,
		);
		if (!target) return;
		queueMicrotask(() => {
			if (!target.isConnected) {
				logger.debug('ContextMenuStore.restoreFocus aborted: target disconnected');
				return;
			}
			try {
				target.focus({preventScroll: true});
				logger.debug('ContextMenuStore.restoreFocus applied focus to target');
			} catch (error) {
				logger.error('ContextMenuStore.restoreFocus failed to focus target', error as Error);
				return;
			}
			if (resumeKeyboardMode) {
				logger.debug('ContextMenuStore.restoreFocus re-entering keyboard mode');
				KeyboardModeStore.enterKeyboardMode(false);
			}
		});
	}
}

export default new ContextMenuStore();
