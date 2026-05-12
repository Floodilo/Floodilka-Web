/*
 * SPDX-License-Identifier: AGPL-3.0-or-later
 * Copyright (C) 2020-2026 Fluxer Contributors
 * Copyright (C) 2026 Floodilka Contributors
 * Modified by Floodilka Contributors starting March 2026. See LICENSE and NOTICE.
 */

import {z} from '~/Schema';

const BasicAuthScheme = z
	.string()
	.regex(/^Basic\s+/i)
	.transform((val) => val.replace(/^Basic\s+/i, ''));

interface ParsedClientCredentials {
	clientId: string;
	clientSecret?: string;
}

export function parseClientCredentials(
	authorizationHeader: string | undefined,
	bodyClientId?: bigint,
	bodyClientSecret?: string,
): ParsedClientCredentials {
	const bodyClientIdStr = bodyClientId?.toString() ?? '';

	if (authorizationHeader) {
		const parseResult = BasicAuthScheme.safeParse(authorizationHeader);
		if (parseResult.success) {
			try {
				const decoded = Buffer.from(parseResult.data, 'base64').toString('utf8');
				const colonIndex = decoded.indexOf(':');

				if (colonIndex >= 0) {
					const id = decoded.slice(0, colonIndex);
					const secret = decoded.slice(colonIndex + 1);

					return {
						clientId: id || bodyClientIdStr,
						clientSecret: secret || bodyClientSecret,
					};
				}
			} catch {}
		}
	}

	return {
		clientId: bodyClientIdStr,
		clientSecret: bodyClientSecret,
	};
}
