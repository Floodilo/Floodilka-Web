/*
 * SPDX-License-Identifier: AGPL-3.0-or-later
 * Copyright (C) 2020-2026 Fluxer Contributors
 * Copyright (C) 2026 Floodilka Contributors
 * Modified by Floodilka Contributors starting March 2026. See LICENSE and NOTICE.
 */

import {autorun} from 'mobx';
import WindowStore from '~/stores/WindowStore';

type FocusChangeListener = (focused: boolean) => void;

class FocusManager {
	private static instance: FocusManager;
	private listeners: Set<FocusChangeListener> = new Set();
	private initialized = false;
	private disposer: (() => void) | null = null;

	static getInstance(): FocusManager {
		if (!FocusManager.instance) {
			FocusManager.instance = new FocusManager();
		}
		return FocusManager.instance;
	}

	init(): void {
		if (this.initialized) return;
		this.initialized = true;

		this.disposer = autorun(() => {
			this.notifyListeners(this.isForeground());
		});
	}

	destroy(): void {
		this.listeners.clear();
		this.disposer?.();
		this.disposer = null;
		this.initialized = false;
	}

	subscribe(listener: FocusChangeListener): () => void {
		this.listeners.add(listener);
		listener(this.isForeground());

		return () => {
			this.listeners.delete(listener);
		};
	}

	private notifyListeners(focused: boolean): void {
		this.listeners.forEach((listener) => {
			try {
				listener(focused);
			} catch (error) {
				console.error('FocusManager: Error in listener:', error);
			}
		});
	}

	private isForeground(): boolean {
		return WindowStore.isFocused() && WindowStore.isVisible();
	}

	isFocused(): boolean {
		return WindowStore.isFocused() && WindowStore.isVisible();
	}
}

export default FocusManager.getInstance();
