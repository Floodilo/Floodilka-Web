/*
 * SPDX-License-Identifier: AGPL-3.0-or-later
 * Copyright (C) 2020-2026 Fluxer Contributors
 * Copyright (C) 2026 Floodilka Contributors
 * Modified by Floodilka Contributors starting March 2026. See LICENSE and NOTICE.
 */

import {makeAutoObservable} from 'mobx';
import {Logger} from '~/lib/Logger';

const logger = new Logger('UserPinnedDMStore');

class UserPinnedDMStore {
	pinnedDMsArray: Array<string> = [];

	constructor() {
		makeAutoObservable(this, {}, {autoBind: true});
	}

	setPinnedDMs(pinnedDMs: Array<string>): void {
		this.pinnedDMsArray = pinnedDMs;
		logger.debug(`Set pinned DMs: ${pinnedDMs.length} channels`);
	}

	isPinned(channelId: string): boolean {
		return this.pinnedDMsArray.includes(channelId);
	}

	getPinIndex(channelId: string): number {
		return this.pinnedDMsArray.indexOf(channelId);
	}

	get pinnedDMs() {
		return this.pinnedDMsArray;
	}
}

export default new UserPinnedDMStore();
