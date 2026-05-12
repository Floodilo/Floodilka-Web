/*
 * SPDX-License-Identifier: AGPL-3.0-or-later
 * Copyright (C) 2020-2026 Fluxer Contributors
 * Copyright (C) 2026 Floodilka Contributors
 * Modified by Floodilka Contributors starting March 2026. See LICENSE and NOTICE.
 */

import {action, makeAutoObservable} from 'mobx';

const InitializationState = {
	LOADING: 'LOADING',
	CONNECTING: 'CONNECTING',
	READY: 'READY',
	ERROR: 'ERROR',
} as const;

type InitializationState = (typeof InitializationState)[keyof typeof InitializationState];

class InitializationStore {
	state: InitializationState = InitializationState.LOADING;
	error: string | null = null;
	readyPayload: unknown = null;

	constructor() {
		makeAutoObservable(this, {}, {autoBind: true});
	}

	get isLoading(): boolean {
		return this.state === InitializationState.LOADING;
	}

	get isConnecting(): boolean {
		return this.state === InitializationState.CONNECTING;
	}

	get isReady(): boolean {
		return this.state === InitializationState.READY;
	}

	get hasError(): boolean {
		return this.state === InitializationState.ERROR;
	}

	get canNavigateToProtectedRoutes(): boolean {
		return this.state === InitializationState.READY;
	}

	@action
	setLoading(): void {
		this.state = InitializationState.LOADING;
		this.error = null;
		this.readyPayload = null;
	}

	@action
	setConnecting(): void {
		this.state = InitializationState.CONNECTING;
		this.error = null;
		this.readyPayload = null;
	}

	@action
	setReady(payload: unknown): void {
		this.state = InitializationState.READY;
		this.error = null;
		this.readyPayload = payload;
	}

	@action
	setError(error: string): void {
		this.state = InitializationState.ERROR;
		this.error = error;
		this.readyPayload = null;
	}

	@action
	reset(): void {
		this.state = InitializationState.LOADING;
		this.error = null;
		this.readyPayload = null;
	}
}

export default new InitializationStore();
