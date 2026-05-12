/*
 * SPDX-License-Identifier: AGPL-3.0-or-later
 * Copyright (C) 2020-2026 Fluxer Contributors
 * Copyright (C) 2026 Floodilka Contributors
 * Modified by Floodilka Contributors starting March 2026. See LICENSE and NOTICE.
 */

import {Endpoints} from '~/Endpoints';
import http from '~/lib/HttpClient';
import {Logger} from '~/lib/Logger';

const logger = new Logger('OAuth2AuthorizationActionCreators');

export interface OAuth2Authorization {
	application: {
		id: string;
		name: string;
		icon: string | null;
		description: string | null;
		bot_public: boolean;
	};
	scopes: Array<string>;
	authorized_at: string;
}

export const listAuthorizations = async (): Promise<Array<OAuth2Authorization>> => {
	try {
		const response = await http.get<Array<OAuth2Authorization>>({url: Endpoints.OAUTH_AUTHORIZATIONS});
		return response.body;
	} catch (error) {
		logger.error('Failed to list OAuth2 authorizations:', error);
		throw error;
	}
};

export const deauthorize = async (applicationId: string): Promise<void> => {
	try {
		await http.delete({url: Endpoints.OAUTH_AUTHORIZATION(applicationId)});
	} catch (error) {
		logger.error('Failed to deauthorize application:', error);
		throw error;
	}
};
