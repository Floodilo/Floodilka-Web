/*
 * SPDX-License-Identifier: AGPL-3.0-or-later
 * Copyright (C) 2020-2026 Fluxer Contributors
 * Copyright (C) 2026 Floodilka Contributors
 * Modified by Floodilka Contributors starting March 2026. See LICENSE and NOTICE.
 */

import {makeAutoObservable, runInAction} from 'mobx';
import {makePersistent} from '~/lib/MobXPersistence';
import {getElectronAPI, isElectron} from '~/utils/NativeUtils';

const STORAGE_KEY = 'SpellcheckStore';

class SpellcheckStore {
	enabled = true;
	languages: Array<string> = [];
	availableLanguages: Array<string> = [];
	electronDisposer: (() => void) | null = null;
	private normalizeLanguages = (langs: Array<string> = []): Array<string> => Array.from(new Set(langs.filter(Boolean)));

	constructor() {
		makeAutoObservable(this, {electronDisposer: false as const}, {autoBind: true});
		void this.initialize();
	}

	private async initialize(): Promise<void> {
		await makePersistent(this, STORAGE_KEY, ['enabled', 'languages']);

		if (!isElectron()) return;

		this.attachElectronListener();
		await this.refreshAvailableLanguages();
		await this.pushToElectron();
	}

	private attachElectronListener(): void {
		const api = getElectronAPI();
		if (!api || this.electronDisposer) return;

		this.electronDisposer = api.onSpellcheckStateChanged((state) => {
			runInAction(() => {
				this.enabled = state.enabled;
				this.languages = this.normalizeLanguages(state.languages ?? []);
			});
		});
	}

	async refreshAvailableLanguages(): Promise<void> {
		const api = getElectronAPI();
		if (!api) return;
		const langs = await api.spellcheckGetAvailableLanguages();
		runInAction(() => {
			this.availableLanguages = langs ?? [];
		});
	}

	async pushToElectron(): Promise<void> {
		const api = getElectronAPI();
		if (!api) return;
		const languages = this.normalizeLanguages(this.languages);
		const state = await api.spellcheckSetState({enabled: this.enabled, languages: [...languages]});
		runInAction(() => {
			this.enabled = state.enabled;
			this.languages = this.normalizeLanguages(state.languages ?? languages);
		});
	}

	setEnabled(enabled: boolean): void {
		this.enabled = enabled;
		void this.pushToElectron();
	}

	setLanguages(languages: Array<string>): void {
		this.languages = this.normalizeLanguages(languages);
		void this.pushToElectron();
	}
}

export default new SpellcheckStore();
