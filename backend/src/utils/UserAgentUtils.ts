/*
 * SPDX-License-Identifier: AGPL-3.0-or-later
 * Copyright (C) 2020-2026 Fluxer Contributors
 * Copyright (C) 2026 Floodilka Contributors
 * Modified by Floodilka Contributors starting March 2026. See LICENSE and NOTICE.
 */

import Bowser from 'bowser';
import {Logger} from '~/Logger';

export interface UserAgentInfo {
	clientOs: string;
	detectedPlatform: string;
}

const UNKNOWN_LABEL = 'Unknown';

function formatName(name?: string | null): string {
	const normalized = name?.trim();
	return normalized || UNKNOWN_LABEL;
}

export function parseUserAgentSafe(userAgentRaw: string): UserAgentInfo {
	const ua = userAgentRaw.trim();
	if (!ua) return {clientOs: UNKNOWN_LABEL, detectedPlatform: UNKNOWN_LABEL};

	try {
		const parser = Bowser.getParser(ua);
		return {
			clientOs: formatName(parser.getOSName()),
			detectedPlatform: formatName(parser.getBrowserName()),
		};
	} catch (error) {
		Logger.warn({error}, 'Failed to parse user agent');
		return {clientOs: UNKNOWN_LABEL, detectedPlatform: UNKNOWN_LABEL};
	}
}

export function resolveSessionClientInfo(args: {userAgent: string | null; isDesktopClient: boolean | null}): {
	clientOs: string;
	clientPlatform: string;
} {
	const parsed = parseUserAgentSafe(args.userAgent ?? '');
	const clientPlatform = args.isDesktopClient ? 'Floodilka Desktop' : parsed.detectedPlatform;
	return {
		clientOs: parsed.clientOs,
		clientPlatform,
	};
}
