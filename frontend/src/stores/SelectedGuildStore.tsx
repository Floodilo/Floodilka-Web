/*
 * SPDX-License-Identifier: AGPL-3.0-or-later
 * Copyright (C) 2020-2026 Fluxer Contributors
 * Copyright (C) 2026 Floodilka Contributors
 * Modified by Floodilka Contributors starting March 2026. See LICENSE and NOTICE.
 */

import {action, makeAutoObservable, reaction} from 'mobx';
import {ME} from '~/Constants';
import {makePersistent} from '~/lib/MobXPersistence';
import NavigationStore from '~/stores/NavigationStore';

class SelectedGuildStore {
	lastSelectedGuildId: string | null = null;
	selectedGuildId: string | null = null;

	selectionNonce: number = 0;

	private navigationDisposer: (() => void) | null = null;

	constructor() {
		makeAutoObservable(this, {}, {autoBind: true});
		void this.initPersistence();
	}

	@action
	private async initPersistence(): Promise<void> {
		await makePersistent(this, 'SelectedGuildStore', ['lastSelectedGuildId']);
		this.setupNavigationReaction();
	}

	private setupNavigationReaction(): void {
		this.navigationDisposer?.();
		this.navigationDisposer = reaction(
			() => NavigationStore.guildId,
			(guildId) => {
				const normalized = this.normalizeGuildFromNavigation(guildId);
				if (normalized) {
					this.applyNavigationGuild(normalized);
				} else {
					this.clearSelection();
				}
			},
			{
				fireImmediately: true,
			},
		);
	}

	private normalizeGuildFromNavigation(guildId: string | null): string | null {
		if (!guildId || guildId === ME) {
			return null;
		}
		return guildId;
	}

	@action
	selectGuild(guildId: string, _forceSync = false): void {
		if (!guildId) {
			return;
		}

		this.setGuild(guildId, {forceNonce: true});
	}

	@action
	syncCurrentGuild(): void {
		this.bumpNonce();
	}

	@action
	deselectGuild(): void {
		this.clearSelection();
	}

	private applyNavigationGuild(guildId: string): void {
		this.setGuild(guildId);
	}

	private setGuild(guildId: string, options?: {forceNonce?: boolean}): void {
		const hasChanged = guildId !== this.selectedGuildId;
		if (hasChanged) {
			this.lastSelectedGuildId = this.selectedGuildId;
			this.selectedGuildId = guildId;
			this.bumpNonce();
			return;
		}

		if (options?.forceNonce) {
			this.bumpNonce();
		}
	}

	private clearSelection(): void {
		if (this.selectedGuildId == null) {
			return;
		}

		this.lastSelectedGuildId = this.selectedGuildId;
		this.selectedGuildId = null;
		this.bumpNonce();
	}

	private bumpNonce(): void {
		this.selectionNonce++;
	}
}

export default new SelectedGuildStore();
