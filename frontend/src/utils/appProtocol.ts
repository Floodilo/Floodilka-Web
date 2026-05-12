/*
 * SPDX-License-Identifier: AGPL-3.0-or-later
 * Copyright (C) 2020-2026 Fluxer Contributors
 * Copyright (C) 2026 Floodilka Contributors
 * Modified by Floodilka Contributors starting March 2026. See LICENSE and NOTICE.
 */

export const APP_PROTOCOL = 'floodilka';
export const APP_PROTOCOL_PREFIX = `${APP_PROTOCOL}://`;

export function buildAppProtocolUrl(path: string): string {
	const cleaned = path.replace(/^\/+/, '');
	return `${APP_PROTOCOL_PREFIX}${cleaned}`;
}
