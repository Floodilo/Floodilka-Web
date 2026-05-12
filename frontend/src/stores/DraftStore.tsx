/*
 * SPDX-License-Identifier: AGPL-3.0-or-later
 * Copyright (C) 2020-2026 Fluxer Contributors
 * Copyright (C) 2026 Floodilka Contributors
 * Modified by Floodilka Contributors starting March 2026. See LICENSE and NOTICE.
 */

import {action, makeAutoObservable} from 'mobx';
import {makePersistent} from '~/lib/MobXPersistence';

class DraftStore {
	drafts: Record<string, string> = {};

	constructor() {
		makeAutoObservable(this, {}, {autoBind: true});
		void this.initPersistence();
	}

	private async initPersistence(): Promise<void> {
		await makePersistent(this, 'DraftStore', ['drafts']);
	}

	@action
	createDraft(channelId: string, content: string): void {
		if (!content || content === this.drafts[channelId]) {
			return;
		}

		this.drafts = {
			...this.drafts,
			[channelId]: content,
		};
	}

	@action
	deleteDraft(channelId: string): void {
		if (!this.drafts[channelId]) {
			return;
		}

		const {[channelId]: _, ...remainingDrafts} = this.drafts;
		this.drafts = remainingDrafts;
	}

	@action
	deleteChannelDraft(channelId: string): void {
		this.deleteDraft(channelId);
	}

	getDraft(channelId: string): string {
		return this.drafts[channelId] ?? '';
	}

	@action
	cleanupEmptyDrafts(): void {
		this.drafts = Object.fromEntries(Object.entries(this.drafts).filter(([_, content]) => content.trim().length > 0));
	}

	getAllDrafts(): ReadonlyArray<[string, string]> {
		return Object.entries(this.drafts);
	}

	hasDraft(channelId: string): boolean {
		return channelId in this.drafts;
	}

	getDraftCount(): number {
		return Object.keys(this.drafts).length;
	}
}

export default new DraftStore();
