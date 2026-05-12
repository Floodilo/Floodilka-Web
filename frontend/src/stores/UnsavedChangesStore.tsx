/*
 * SPDX-License-Identifier: AGPL-3.0-or-later
 * Copyright (C) 2020-2026 Fluxer Contributors
 * Copyright (C) 2026 Floodilka Contributors
 * Modified by Floodilka Contributors starting March 2026. See LICENSE and NOTICE.
 */

import {makeAutoObservable} from 'mobx';

interface TabData {
	onReset?: () => void;
	onSave?: () => void;
	isSubmitting?: boolean;
}

class UnsavedChangesStore {
	unsavedChanges: Record<string, boolean> = {};
	flashTriggers: Record<string, number> = {};
	tabData: Record<string, TabData> = {};

	constructor() {
		makeAutoObservable(this, {}, {autoBind: true});
	}

	setUnsavedChanges(tabId: string, hasChanges: boolean): void {
		this.unsavedChanges = {
			...this.unsavedChanges,
			[tabId]: hasChanges,
		};
	}

	triggerFlash(tabId: string): void {
		this.flashTriggers = {
			...this.flashTriggers,
			[tabId]: (this.flashTriggers[tabId] || 0) + 1,
		};
	}

	clearUnsavedChanges(tabId: string): void {
		const {[tabId]: _unsaved, ...remainingUnsaved} = this.unsavedChanges;
		const {[tabId]: _tabData, ...remainingTabData} = this.tabData;
		this.unsavedChanges = remainingUnsaved;
		this.tabData = remainingTabData;
	}

	setTabData(tabId: string, data: TabData): void {
		this.tabData = {
			...this.tabData,
			[tabId]: data,
		};
	}

	hasUnsavedChanges(tabId: string): boolean {
		return this.unsavedChanges[tabId] || false;
	}

	getFlashTrigger(tabId: string): number {
		return this.flashTriggers[tabId] || 0;
	}

	getTabData(tabId: string): TabData {
		return this.tabData[tabId] || {};
	}
}

export default new UnsavedChangesStore();
