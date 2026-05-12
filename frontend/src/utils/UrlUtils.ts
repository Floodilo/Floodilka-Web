/*
 * SPDX-License-Identifier: AGPL-3.0-or-later
 * Copyright (C) 2020-2026 Fluxer Contributors
 * Copyright (C) 2026 Floodilka Contributors
 * Modified by Floodilka Contributors starting March 2026. See LICENSE and NOTICE.
 */

import RuntimeConfigStore from '~/stores/RuntimeConfigStore';
import {buildMediaProxyURL} from '~/utils/MediaProxyUtils';

export function mediaUrl(path: string): string {
	return buildMediaProxyURL(`${RuntimeConfigStore.mediaEndpoint}/${path}`);
}

export function cdnUrl(path: string): string {
	return buildMediaProxyURL(`${RuntimeConfigStore.cdnEndpoint}/${path}`);
}

export function webhookUrl(webhookId: string, token: string): string {
	return `${RuntimeConfigStore.apiPublicEndpoint}/webhooks/${webhookId}/${token}`;
}

export function siteUrl(path: string): string {
	return `${RuntimeConfigStore.webAppEndpoint}/${path}`;
}

export function adminUrl(path: string): string {
	return `${RuntimeConfigStore.adminEndpoint}/${path}`;
}
