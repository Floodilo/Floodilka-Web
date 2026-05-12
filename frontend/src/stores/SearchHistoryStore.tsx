/*
 * SPDX-License-Identifier: AGPL-3.0-or-later
 * Copyright (C) 2020-2026 Fluxer Contributors
 * Copyright (C) 2026 Floodilka Contributors
 * Modified by Floodilka Contributors starting March 2026. See LICENSE and NOTICE.
 */

import {action, makeAutoObservable} from 'mobx';
import {makePersistent} from '~/lib/MobXPersistence';
import type {SearchHints} from '~/utils/SearchQueryParser';

export interface SearchHistoryEntry {
	query: string;
	hints?: SearchHints;
	ts: number;
}

class SearchHistoryStoreImpl {
	entriesByChannel: Record<string, Array<SearchHistoryEntry>> = {};

	constructor() {
		makeAutoObservable(this, {}, {autoBind: true});
		void makePersistent(this, 'SearchHistoryStore', ['entriesByChannel']);
	}

	private getEntries(channelId?: string): Array<SearchHistoryEntry> {
		if (!channelId) return [];
		return this.entriesByChannel[channelId] ?? [];
	}

	recent(channelId?: string): ReadonlyArray<SearchHistoryEntry> {
		return this.getEntries(channelId);
	}

	search(term: string, channelId?: string): ReadonlyArray<SearchHistoryEntry> {
		const entries = this.getEntries(channelId);
		const t = term.trim().toLowerCase();
		if (!t) return entries;
		return entries.filter((e) => e.query.toLowerCase().includes(t));
	}

	@action
	add(query: string, channelId?: string, hints?: SearchHints): void {
		if (!channelId) return;
		const q = query.trim();
		if (!q) return;

		if (!this.entriesByChannel[channelId]) {
			this.entriesByChannel[channelId] = [];
		}

		const entries = this.entriesByChannel[channelId];
		const ts = Date.now();
		const existingIdx = entries.findIndex((e) => e.query === q);
		const entry: SearchHistoryEntry = {query: q, hints, ts};

		if (existingIdx !== -1) {
			entries.splice(existingIdx, 1);
		}
		entries.unshift(entry);
		if (entries.length > 10) {
			this.entriesByChannel[channelId] = entries.slice(0, 10);
		}
	}

	@action
	clear(channelId?: string): void {
		if (!channelId) return;
		delete this.entriesByChannel[channelId];
	}

	@action
	clearAll(): void {
		this.entriesByChannel = {};
	}
}

export default new SearchHistoryStoreImpl();
