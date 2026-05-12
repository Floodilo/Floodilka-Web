/*
 * SPDX-License-Identifier: AGPL-3.0-or-later
 * Copyright (C) 2020-2026 Fluxer Contributors
 * Copyright (C) 2026 Floodilka Contributors
 * Modified by Floodilka Contributors starting March 2026. See LICENSE and NOTICE.
 */

import {makeAutoObservable} from 'mobx';
import {ComponentDispatch} from '~/lib/ComponentDispatch';
import {Logger} from '~/lib/Logger';
import {makePersistent} from '~/lib/MobXPersistence';
import type {FavoriteMemeRecord} from '~/records/FavoriteMemeRecord';

type MemeUsageEntry = Readonly<{
	count: number;
	lastUsed: number;
}>;

const MAX_FRECENT_MEMES = 21;
const FRECENCY_TIME_DECAY_HOURS = 24 * 7;

const logger = new Logger('MemesPickerStore');

class MemesPickerStore {
	memeUsage: Record<string, MemeUsageEntry> = {};
	favoriteMemes: Array<string> = [];
	collapsedCategories: Array<string> = [];

	constructor() {
		makeAutoObservable(this, {}, {autoBind: true});
		void this.initPersistence();
	}

	private async initPersistence(): Promise<void> {
		await makePersistent(this, 'MemesPickerStore', ['memeUsage', 'favoriteMemes', 'collapsedCategories']);
	}

	trackMemeUsage(memeKey: string): void {
		const now = Date.now();
		const currentUsage = this.memeUsage[memeKey];
		const newCount = (currentUsage?.count ?? 0) + 1;

		this.memeUsage[memeKey] = {
			count: newCount,
			lastUsed: now,
		};
	}

	toggleFavorite(memeKey: string): void {
		if (this.favoriteMemes.includes(memeKey)) {
			const index = this.favoriteMemes.indexOf(memeKey);
			if (index > -1) {
				this.favoriteMemes.splice(index, 1);
			}
		} else {
			this.favoriteMemes.push(memeKey);
		}

		ComponentDispatch.dispatch('MEMES_PICKER_RERENDER');
		logger.debug(`Toggled favorite meme: ${memeKey}`);
	}

	toggleCategory(category: string): void {
		if (this.collapsedCategories.includes(category)) {
			const index = this.collapsedCategories.indexOf(category);
			if (index > -1) {
				this.collapsedCategories.splice(index, 1);
			}
		} else {
			this.collapsedCategories.push(category);
		}

		ComponentDispatch.dispatch('MEMES_PICKER_RERENDER');
		logger.debug(`Toggled category: ${category}`);
	}

	isFavorite(meme: FavoriteMemeRecord): boolean {
		return this.favoriteMemes.includes(this.getMemeKey(meme));
	}

	isCategoryCollapsed(categoryId: string): boolean {
		return this.collapsedCategories.includes(categoryId);
	}

	private getFrecencyScore(entry: MemeUsageEntry): number {
		const now = Date.now();
		const hoursSinceLastUse = (now - entry.lastUsed) / (1000 * 60 * 60);
		const timeDecay = Math.max(0, 1 - hoursSinceLastUse / FRECENCY_TIME_DECAY_HOURS);
		return entry.count * (1 + timeDecay);
	}

	getFrecentMemes(
		allMemes: ReadonlyArray<FavoriteMemeRecord>,
		limit: number = MAX_FRECENT_MEMES,
	): Array<FavoriteMemeRecord> {
		const memeScores: Array<{meme: FavoriteMemeRecord; score: number}> = [];

		for (const meme of allMemes) {
			const memeKey = this.getMemeKey(meme);
			const usage = this.memeUsage[memeKey];

			if (usage) {
				const score = this.getFrecencyScore(usage);
				memeScores.push({meme, score});
			}
		}

		memeScores.sort((a, b) => b.score - a.score);
		return memeScores.slice(0, limit).map((item) => item.meme);
	}

	getFavoriteMemes(allMemes: ReadonlyArray<FavoriteMemeRecord>): Array<FavoriteMemeRecord> {
		const favorites: Array<FavoriteMemeRecord> = [];

		for (const meme of allMemes) {
			if (this.isFavorite(meme)) {
				favorites.push(meme);
			}
		}

		return favorites;
	}

	getFrecencyScoreForMeme(meme: FavoriteMemeRecord): number {
		const usage = this.memeUsage[this.getMemeKey(meme)];
		return usage ? this.getFrecencyScore(usage) : 0;
	}

	private getMemeKey(meme: FavoriteMemeRecord): string {
		return meme.id;
	}
}

export default new MemesPickerStore();
