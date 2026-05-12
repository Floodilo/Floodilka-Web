/*
 * SPDX-License-Identifier: AGPL-3.0-or-later
 * Copyright (C) 2020-2026 Fluxer Contributors
 * Copyright (C) 2026 Floodilka Contributors
 * Modified by Floodilka Contributors starting March 2026. See LICENSE and NOTICE.
 */

import {makeAutoObservable} from 'mobx';
import {Logger} from '~/lib/Logger';
import {makePersistent} from '~/lib/MobXPersistence';

const logger = new Logger('InboxStore');

export type InboxTab = 'bookmarks' | 'mentions' | 'scheduled';

class InboxStore {
	selectedTab: InboxTab = 'bookmarks';

	constructor() {
		makeAutoObservable(this, {}, {autoBind: true});
		this.initPersistence();
	}

	private async initPersistence(): Promise<void> {
		await makePersistent(this, 'InboxStore', ['selectedTab']);
	}

	setTab(tab: InboxTab): void {
		if (this.selectedTab !== tab) {
			this.selectedTab = tab;
			logger.debug(`Set inbox tab to: ${tab}`);
		}
	}

	getSelectedTab(): InboxTab {
		return this.selectedTab;
	}
}

export default new InboxStore();
