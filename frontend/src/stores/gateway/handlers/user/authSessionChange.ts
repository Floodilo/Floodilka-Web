/*
 * SPDX-License-Identifier: AGPL-3.0-or-later
 * Copyright (C) 2020-2026 Fluxer Contributors
 * Copyright (C) 2026 Floodilka Contributors
 * Modified by Floodilka Contributors starting March 2026. See LICENSE and NOTICE.
 */

import AuthSessionStore from '~/stores/AuthSessionStore';
import type {GatewayHandlerContext} from '../index';

interface AuthSessionChangePayload {
	new_token?: string;
	new_auth_session_id_hash?: string | null;
}

export function handleAuthSessionChange(data: AuthSessionChangePayload, context: GatewayHandlerContext): void {
	if (data.new_token) {
		context.socket?.setToken(data.new_token);
	}

	if (data.new_auth_session_id_hash) {
		AuthSessionStore.handleAuthSessionChange(data.new_auth_session_id_hash);
	}
}
