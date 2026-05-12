/*
 * SPDX-License-Identifier: AGPL-3.0-or-later
 * Copyright (C) 2020-2026 Fluxer Contributors
 * Copyright (C) 2026 Floodilka Contributors
 * Modified by Floodilka Contributors starting March 2026. See LICENSE and NOTICE.
 */

import {makeAutoObservable} from 'mobx';
import type {GuildSettingsTabType} from '~/components/modals/utils/guildSettingsConstants';

interface NavigationHandler {
	guildId: string;
	navigate: (tab: GuildSettingsTabType) => void;
}

class GuildSettingsModalStore {
	private activeHandler: NavigationHandler | null = null;

	constructor() {
		makeAutoObservable(this, {}, {autoBind: true});
	}

	register(handler: NavigationHandler): void {
		this.activeHandler = handler;
	}

	unregister(guildId: string): void {
		if (this.activeHandler?.guildId === guildId) {
			this.activeHandler = null;
		}
	}

	isOpen(guildId?: string): boolean {
		if (!this.activeHandler) return false;
		if (guildId) return this.activeHandler.guildId === guildId;
		return true;
	}

	navigateToTab(guildId: string, tab: GuildSettingsTabType): boolean {
		if (!this.activeHandler) return false;
		if (this.activeHandler.guildId !== guildId) return false;
		this.activeHandler.navigate(tab);
		return true;
	}
}

export default new GuildSettingsModalStore();
