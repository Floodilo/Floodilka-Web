/*
 * SPDX-License-Identifier: AGPL-3.0-or-later
 * Copyright (C) 2020-2026 Fluxer Contributors
 * Copyright (C) 2026 Floodilka Contributors
 * Modified by Floodilka Contributors starting March 2026. See LICENSE and NOTICE.
 */

import {Endpoints} from '~/Endpoints';
import http from '~/lib/HttpClient';
import {Logger} from '~/lib/Logger';

const logger = new Logger('Notes');

export const update = async (userId: string, note: string | null): Promise<void> => {
	try {
		await http.put({url: Endpoints.USER_NOTE(userId), body: {note}});
		logger.debug(`Updated note for user ${userId} to ${note ? 'new value' : 'null'}`);
	} catch (error) {
		logger.error(`Failed to update note for user ${userId}:`, error);
		throw error;
	}
};
