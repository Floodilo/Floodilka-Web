/*
 * SPDX-License-Identifier: AGPL-3.0-or-later
 * Copyright (C) 2020-2026 Fluxer Contributors
 * Copyright (C) 2026 Floodilka Contributors
 * Modified by Floodilka Contributors starting March 2026. See LICENSE and NOTICE.
 */

import {makeAutoObservable, runInAction} from 'mobx';
import type {ExpressionPickerTabType} from '~/components/popouts/ExpressionPickerPopout';

class ExpressionPickerStore {
	isOpen = false;
	selectedTab: ExpressionPickerTabType = 'emojis';
	channelId: string | null = null;

	constructor() {
		makeAutoObservable(this, {}, {autoBind: true});
	}

	open(channelId: string, tab?: ExpressionPickerTabType): void {
		runInAction(() => {
			this.isOpen = true;
			if (tab !== undefined) {
				this.selectedTab = tab;
			}
			this.channelId = channelId;
		});
	}

	close(): void {
		runInAction(() => {
			if (this.isOpen) {
				this.isOpen = false;
			}
		});
	}

	toggle(channelId: string, tab: ExpressionPickerTabType): void {
		runInAction(() => {
			if (this.isOpen && this.selectedTab === tab && this.channelId === channelId) {
				this.isOpen = false;
			} else {
				this.isOpen = true;
				this.selectedTab = tab;
				this.channelId = channelId;
			}
		});
	}

	setTab(tab: ExpressionPickerTabType): void {
		runInAction(() => {
			if (this.selectedTab !== tab) {
				this.selectedTab = tab;
			}
		});
	}
}

export default new ExpressionPickerStore();
