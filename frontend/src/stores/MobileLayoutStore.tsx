/*
 * SPDX-License-Identifier: AGPL-3.0-or-later
 * Copyright (C) 2020-2026 Fluxer Contributors
 * Copyright (C) 2026 Floodilka Contributors
 * Modified by Floodilka Contributors starting March 2026. See LICENSE and NOTICE.
 */

import {makeAutoObservable, reaction} from 'mobx';
import {makePersistent} from '~/lib/MobXPersistence';
import {Platform} from '~/lib/Platform';
import WindowStore from '~/stores/WindowStore';

const MOBILE_ENABLE_BREAKPOINT = 640;
const MOBILE_DISABLE_BREAKPOINT = 768;

const shouldForceMobileLayout = (): boolean => Platform.isMobileBrowser;

const getInitialMobileEnabled = (): boolean => {
	if (shouldForceMobileLayout()) {
		return true;
	}
	return window.innerWidth < MOBILE_ENABLE_BREAKPOINT;
};

class MobileLayoutStore {
	navExpanded = true;
	chatExpanded = false;
	enabled = getInitialMobileEnabled();

	constructor() {
		makeAutoObservable(this, {}, {autoBind: true});
		this.initPersistence();
		this.initWindowSync();
	}

	private async initPersistence(): Promise<void> {
		await makePersistent(this, 'MobileLayoutStore', ['navExpanded', 'chatExpanded']);
	}

	private initWindowSync(): void {
		this.handleWindowSizeChange();

		reaction(
			() => WindowStore.windowSize,
			() => this.handleWindowSizeChange(),
			{fireImmediately: false},
		);
	}

	isEnabled() {
		return this.enabled;
	}

	private handleWindowSizeChange(): void {
		const windowSize = WindowStore.windowSize;
		const forceMobile = shouldForceMobileLayout();
		const threshold = this.enabled ? MOBILE_DISABLE_BREAKPOINT : MOBILE_ENABLE_BREAKPOINT;
		const widthBased = windowSize.width < threshold;
		const newEnabled = forceMobile || widthBased;

		if (newEnabled === this.enabled) {
			return;
		}

		this.enabled = newEnabled;
		if (newEnabled) {
			this.navExpanded = this.navExpanded && !this.chatExpanded;
		}
	}

	updateState(data: {navExpanded?: boolean; chatExpanded?: boolean}): void {
		const hasChanges =
			(data.navExpanded !== undefined && data.navExpanded !== this.navExpanded) ||
			(data.chatExpanded !== undefined && data.chatExpanded !== this.chatExpanded);

		if (!hasChanges) {
			return;
		}

		if (data.navExpanded !== undefined) {
			this.navExpanded = data.navExpanded;
			if (data.navExpanded && this.enabled && this.chatExpanded) {
				this.chatExpanded = false;
			}
		}

		if (data.chatExpanded !== undefined) {
			this.chatExpanded = data.chatExpanded;
			if (data.chatExpanded && this.enabled && this.navExpanded) {
				this.navExpanded = false;
			}
		}
	}

	isMobileLayout(): boolean {
		return this.enabled;
	}

	get platformMobileDetected(): boolean {
		return shouldForceMobileLayout();
	}

	isNavExpanded(): boolean {
		return this.navExpanded;
	}

	isChatExpanded(): boolean {
		return this.chatExpanded;
	}
}

export default new MobileLayoutStore();
