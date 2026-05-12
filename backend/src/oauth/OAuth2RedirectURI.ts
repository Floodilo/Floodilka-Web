/*
 * SPDX-License-Identifier: AGPL-3.0-or-later
 * Copyright (C) 2020-2026 Fluxer Contributors
 * Copyright (C) 2026 Floodilka Contributors
 * Modified by Floodilka Contributors starting March 2026. See LICENSE and NOTICE.
 */

import {createStringType} from '~/Schema';

const isLoopbackHost = (hostname: string) => {
	const lowercaseHost = hostname.toLowerCase();
	return (
		lowercaseHost === 'localhost' ||
		lowercaseHost === '127.0.0.1' ||
		lowercaseHost === '[::1]' ||
		lowercaseHost.endsWith('.localhost')
	);
};

const isValidRedirectURI = (value: string, allowAnyHttp: boolean) => {
	try {
		const url = new URL(value);
		if (url.protocol !== 'http:' && url.protocol !== 'https:') {
			return false;
		}

		if (!allowAnyHttp && url.protocol === 'http:' && !isLoopbackHost(url.hostname)) {
			return false;
		}

		return !!url.host;
	} catch {
		return false;
	}
};

const createRedirectURIType = (allowAnyHttp: boolean, message: string) =>
	createStringType(1).refine((value) => isValidRedirectURI(value, allowAnyHttp), message);

export const OAuth2RedirectURICreateType = createRedirectURIType(
	false,
	'Redirect URIs must use HTTPS, or HTTP for localhost only',
);
export const OAuth2RedirectURIUpdateType = createRedirectURIType(true, 'Redirect URIs must use HTTP or HTTPS');
