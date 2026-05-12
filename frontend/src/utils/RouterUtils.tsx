/*
 * SPDX-License-Identifier: AGPL-3.0-or-later
 * Copyright (C) 2020-2026 Fluxer Contributors
 * Copyright (C) 2026 Floodilka Contributors
 * Modified by Floodilka Contributors starting March 2026. See LICENSE and NOTICE.
 */

import {Logger} from '~/lib/Logger';
import {createBrowserHistory, type HistoryAdapter} from '~/lib/router';

const logger = new Logger('RouterUtils');

export const history: HistoryAdapter | null = createBrowserHistory();

export const transitionTo = (path: string) => {
	logger.info('transitionTo', path);
	if (history) {
		const current = history.getLocation().url.pathname;
		if (current === path) return;
		history.push(new URL(path, window.location.origin));
	}
};

export const replaceWith = (path: string) => {
	logger.info('replaceWith', path);
	if (history) {
		const current = history.getLocation().url.pathname;
		if (current === path) return;
		history.replace(new URL(path, window.location.origin));
	}
};

export const getHistory = () => history;
