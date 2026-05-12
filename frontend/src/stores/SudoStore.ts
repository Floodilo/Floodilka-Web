/*
 * SPDX-License-Identifier: AGPL-3.0-or-later
 * Copyright (C) 2020-2026 Fluxer Contributors
 * Copyright (C) 2026 Floodilka Contributors
 * Modified by Floodilka Contributors starting March 2026. See LICENSE and NOTICE.
 */

import {makeAutoObservable} from 'mobx';

import HttpClient from '~/lib/HttpClient';
import SudoPromptStore from '~/stores/SudoPromptStore';

class SudoStore {
	private token: string | null = null;
	private expiresAt: number | null = null;

	constructor() {
		makeAutoObservable(this, {}, {autoBind: true});
	}

	init(): void {
		HttpClient.setSudoTokenProvider(this.getValidToken);

		HttpClient.setSudoTokenListener((token) => {
			if (token) {
				this.setToken(token);
			}
			SudoPromptStore.handleTokenReceived(token);
		});

		HttpClient.setSudoTokenInvalidator(this.clearToken);
	}

	get hasValidTokenFlag(): boolean {
		return Boolean(this.token && this.expiresAt && Date.now() < this.expiresAt);
	}

	private getValidToken = (): string | null => {
		if (this.token && this.expiresAt && Date.now() < this.expiresAt) {
			return this.token;
		}
		return null;
	};

	setToken(token: string): void {
		this.token = token;
		this.expiresAt = Date.now() + 4.5 * 60 * 1000;
	}

	clearToken(): void {
		this.token = null;
		this.expiresAt = null;
	}

	hasValidToken(): boolean {
		return this.hasValidTokenFlag;
	}
}

export default new SudoStore();
