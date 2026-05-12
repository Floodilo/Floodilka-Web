/*
 * SPDX-License-Identifier: AGPL-3.0-or-later
 * Copyright (C) 2020-2026 Fluxer Contributors
 * Copyright (C) 2026 Floodilka Contributors
 * Modified by Floodilka Contributors starting March 2026. See LICENSE and NOTICE.
 */

import {Endpoints} from '~/Endpoints';
import http from '~/lib/HttpClient';
import {Logger} from '~/lib/Logger';
import type {AuthSession} from '~/records/AuthSessionRecord';
import AuthSessionStore from '~/stores/AuthSessionStore';

const logger = new Logger('AuthSessionsService');

export const fetch = async (): Promise<void> => {
	logger.debug('Fetching authentication sessions');
	AuthSessionStore.fetchPending();

	try {
		const response = await http.get<Array<AuthSession>>({url: Endpoints.AUTH_SESSIONS, retries: 2});
		const sessions = response.body ?? [];
		logger.info(`Fetched ${sessions.length} authentication sessions`);
		AuthSessionStore.fetchSuccess(sessions);
	} catch (error) {
		logger.error('Failed to fetch authentication sessions:', error);
		AuthSessionStore.fetchError();
		throw error;
	}
};

export const logout = async (sessionIdHashes: Array<string>): Promise<void> => {
	if (!sessionIdHashes.length) {
		logger.warn('Attempted to logout with empty session list');
		return;
	}
	logger.debug(`Logging out ${sessionIdHashes.length} sessions`);
	AuthSessionStore.logoutPending();
	try {
		await http.post({
			url: Endpoints.AUTH_SESSIONS_LOGOUT,
			body: {session_id_hashes: sessionIdHashes},
			timeout: 10000,
			retries: 0,
		});
		logger.info(`Successfully logged out ${sessionIdHashes.length} sessions`);
		AuthSessionStore.logoutSuccess(sessionIdHashes);
	} catch (error) {
		logger.error('Failed to log out sessions:', error);
		AuthSessionStore.logoutError();
		throw error;
	}
};
