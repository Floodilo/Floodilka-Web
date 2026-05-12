/*
 * SPDX-License-Identifier: AGPL-3.0-or-later
 * Copyright (C) 2020-2026 Fluxer Contributors
 * Copyright (C) 2026 Floodilka Contributors
 * Modified by Floodilka Contributors starting March 2026. See LICENSE and NOTICE.
 */

import {makeAutoObservable} from 'mobx';
import {makePersistent} from '~/lib/MobXPersistence';

class InputMonitoringPromptsStore {
	hasSeenInputMonitoringCTA = false;

	private shownThisSession = false;

	constructor() {
		makeAutoObservable(this, {}, {autoBind: true});
		void this.initPersistence();
	}

	private async initPersistence(): Promise<void> {
		await makePersistent(this, 'InputMonitoringPromptsStore', ['hasSeenInputMonitoringCTA']);
	}

	shouldShowInputMonitoringCTA(): boolean {
		return !this.hasSeenInputMonitoringCTA && !this.shownThisSession;
	}

	markShownThisSession(): void {
		this.shownThisSession = true;
	}

	dismissInputMonitoringCTA(): void {
		this.hasSeenInputMonitoringCTA = true;
		this.shownThisSession = true;
	}

	resetInputMonitoringCTA(): void {
		this.hasSeenInputMonitoringCTA = false;
		this.shownThisSession = false;
	}
}

export default new InputMonitoringPromptsStore();
