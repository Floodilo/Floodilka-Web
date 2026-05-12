/*
 * SPDX-License-Identifier: AGPL-3.0-or-later
 * Copyright (C) 2020-2026 Fluxer Contributors
 * Copyright (C) 2026 Floodilka Contributors
 * Modified by Floodilka Contributors starting March 2026. See LICENSE and NOTICE.
 */

import {makeAutoObservable} from 'mobx';
import {makePersistent} from '~/lib/MobXPersistence';

export type GuildMemberViewMode = 'table' | 'grid';

class GuildMemberLayoutStore {
	memberViewMode: GuildMemberViewMode = 'table';

	constructor() {
		makeAutoObservable(this, {}, {autoBind: true});
		void this.initPersistence();
	}

	private async initPersistence(): Promise<void> {
		await makePersistent(this, 'GuildMemberLayoutStore', ['memberViewMode']);
	}

	getViewMode(): GuildMemberViewMode {
		return this.memberViewMode;
	}

	setViewMode(mode: GuildMemberViewMode): void {
		this.memberViewMode = mode;
	}
}

export default new GuildMemberLayoutStore();
