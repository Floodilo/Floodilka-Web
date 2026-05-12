/*
 * SPDX-License-Identifier: AGPL-3.0-or-later
 * Copyright (C) 2020-2026 Fluxer Contributors
 * Copyright (C) 2026 Floodilka Contributors
 * Modified by Floodilka Contributors starting March 2026. See LICENSE and NOTICE.
 */

import {makeAutoObservable} from 'mobx';

export type FriendsTab = 'online' | 'all' | 'pending' | 'add';

class FriendsTabStore {
	pendingTab: FriendsTab | null = null;

	constructor() {
		makeAutoObservable(this, {}, {autoBind: true});
	}

	setTab(tab: FriendsTab): void {
		this.pendingTab = tab;
	}

	consumeTab(): FriendsTab | null {
		const tab = this.pendingTab;
		this.pendingTab = null;
		return tab;
	}
}

export default new FriendsTabStore();
