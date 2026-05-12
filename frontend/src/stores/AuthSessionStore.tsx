/*
 * SPDX-License-Identifier: AGPL-3.0-or-later
 * Copyright (C) 2020-2026 Fluxer Contributors
 * Copyright (C) 2026 Floodilka Contributors
 * Modified by Floodilka Contributors starting March 2026. See LICENSE and NOTICE.
 */

import {makeAutoObservable} from 'mobx';
import {type AuthSession, AuthSessionRecord} from '~/records/AuthSessionRecord';

type FetchStatus = 'idle' | 'pending' | 'success' | 'error';

class AuthSessionStore {
	authSessionIdHash: string | null = null;
	authSessions: Array<AuthSessionRecord> = [];
	fetchStatus: FetchStatus = 'idle';
	isDeleteError = false;

	constructor() {
		makeAutoObservable(this, {}, {autoBind: true});
	}

	handleConnectionOpen(authSessionIdHash: string): void {
		this.authSessionIdHash = authSessionIdHash;
	}

	handleAuthSessionChange(authSessionIdHash: string): void {
		this.authSessionIdHash = authSessionIdHash;
	}

	fetchPending(): void {
		this.fetchStatus = 'pending';
	}

	fetchSuccess(authSessions: ReadonlyArray<AuthSession>): void {
		this.authSessions = authSessions.map((session) => new AuthSessionRecord(session));
		this.fetchStatus = 'success';
	}

	fetchError(): void {
		this.fetchStatus = 'error';
	}

	logoutPending(): void {
		this.isDeleteError = false;
	}

	logoutSuccess(sessionIdHashes: ReadonlyArray<string>): void {
		this.authSessions = this.authSessions.filter((session) => !sessionIdHashes.includes(session.id));
	}

	logoutError(): void {
		this.isDeleteError = true;
	}
}

export default new AuthSessionStore();
