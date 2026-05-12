/*
 * SPDX-License-Identifier: AGPL-3.0-or-later
 * Copyright (C) 2020-2026 Fluxer Contributors
 * Copyright (C) 2026 Floodilka Contributors
 * Modified by Floodilka Contributors starting March 2026. See LICENSE and NOTICE.
 */

import crypto from 'node:crypto';

const BASE64_URL_REGEX = /=*$/;

const decodeComponent = (component: string) => decodeURIComponent(component);

const createSignature = (inputString: string, mediaProxySecretKey: string): string => {
	const hmac = crypto.createHmac('sha256', mediaProxySecretKey);
	hmac.update(inputString);
	return hmac.digest('base64url').replace(BASE64_URL_REGEX, '');
};

export const verifySignature = (
	proxyUrlPath: string,
	providedSignature: string,
	mediaProxySecretKey: string,
): boolean => {
	const expectedSignature = createSignature(proxyUrlPath, mediaProxySecretKey);
	return crypto.timingSafeEqual(Buffer.from(expectedSignature), Buffer.from(providedSignature));
};

export const reconstructOriginalURL = (proxyUrlPath: string): string => {
	const parts = proxyUrlPath.split('/');
	let currentIndex = 0;
	let query = '';
	if (parts[currentIndex].includes('%3D')) {
		query = decodeComponent(parts[currentIndex]);
		currentIndex += 1;
	}
	const protocol = parts[currentIndex++];
	if (!protocol) throw new Error('Protocol is missing in the proxy URL path.');
	const hostPart = parts[currentIndex++];
	if (!hostPart) throw new Error('Hostname is missing in the proxy URL path.');
	const [encodedHostname, encodedPort] = hostPart.split(':');
	const hostname = decodeComponent(encodedHostname);
	const port = encodedPort ? decodeComponent(encodedPort) : '';
	const encodedPath = parts.slice(currentIndex).join('/');
	const path = decodeComponent(encodedPath);
	return `${protocol}://${hostname}${port ? `:${port}` : ''}/${path}${query ? `?${query}` : ''}`;
};
