/*
 * SPDX-License-Identifier: AGPL-3.0-or-later
 * Copyright (C) 2020-2026 Fluxer Contributors
 * Copyright (C) 2026 Floodilka Contributors
 * Modified by Floodilka Contributors starting March 2026. See LICENSE and NOTICE.
 */

import {makePersistent} from '~/lib/MobXPersistence';
import {makeAutoObservable} from 'mobx';

class GuildFolderExpandedStore {
	expandedFolderIds: Array<number> = [];

	constructor() {
		makeAutoObservable(this, {}, {autoBind: true});
		void this.initPersistence();
	}

	private async initPersistence(): Promise<void> {
		await makePersistent(this, 'GuildFolderExpandedStore', ['expandedFolderIds']);
	}

	isExpanded(folderId: number): boolean {
		return this.expandedFolderIds.includes(folderId);
	}

	toggleExpanded(folderId: number): void {
		if (this.expandedFolderIds.includes(folderId)) {
			const index = this.expandedFolderIds.indexOf(folderId);
			if (index > -1) {
				this.expandedFolderIds.splice(index, 1);
			}
		} else {
			this.expandedFolderIds.push(folderId);
		}
	}
}

export default new GuildFolderExpandedStore();
