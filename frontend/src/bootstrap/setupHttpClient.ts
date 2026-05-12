/*
 * SPDX-License-Identifier: AGPL-3.0-or-later
 * Copyright (C) 2020-2026 Fluxer Contributors
 * Copyright (C) 2026 Floodilka Contributors
 * Modified by Floodilka Contributors starting March 2026. See LICENSE and NOTICE.
 */

import HttpClient from '~/lib/HttpClient';
import SessionManager from '~/lib/SessionManager';
import SudoPromptStore from '~/stores/SudoPromptStore';
import SudoStore from '~/stores/SudoStore';

export function setupHttpClient(): void {
	HttpClient.setAuthTokenProvider(() => SessionManager.token);

	SudoStore.init();
	SudoPromptStore.init();
}
