/*
 * SPDX-License-Identifier: AGPL-3.0-or-later
 * Copyright (C) 2020-2026 Fluxer Contributors
 * Copyright (C) 2026 Floodilka Contributors
 * Modified by Floodilka Contributors starting March 2026. See LICENSE and NOTICE.
 */

import {makeAutoObservable, reaction} from 'mobx';
import {Logger} from '~/lib/Logger';
import {makePersistent} from '~/lib/MobXPersistence';

const logger = new Logger('MemberListStore');

const getInitialWidth = (): number => window.innerWidth;

class MemberListStore {
	isMembersOpen = getInitialWidth() >= 1024;

	constructor() {
		makeAutoObservable(this, {}, {autoBind: true});
		void this.initPersistence();
	}

	private async initPersistence(): Promise<void> {
		await makePersistent(this, 'MemberListStore', ['isMembersOpen']);
	}

	toggleMembers(): void {
		this.isMembersOpen = !this.isMembersOpen;
		logger.debug(`Toggled members list: ${this.isMembersOpen}`);
	}

	subscribe(callback: () => void): () => void {
		return reaction(
			() => this.isMembersOpen,
			() => callback(),
			{fireImmediately: true},
		);
	}
}

export default new MemberListStore();
