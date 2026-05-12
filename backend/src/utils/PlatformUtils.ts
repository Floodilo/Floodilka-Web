/*
 * SPDX-License-Identifier: AGPL-3.0-or-later
 * Copyright (C) 2020-2026 Fluxer Contributors
 * Copyright (C) 2026 Floodilka Contributors
 * Modified by Floodilka Contributors starting March 2026. See LICENSE and NOTICE.
 */

export type ClientPlatform = 'web' | 'desktop' | 'android' | 'ios';

export function resolveClientPlatform(request: Request): ClientPlatform {
	const header = request.headers.get('x-floodilka-platform')?.trim().toLowerCase();
	if (header === 'desktop') return 'desktop';
	if (header === 'ios') return 'ios';
	if (header === 'android') return 'android';
	if (header === 'web') return 'web';

	const ua = request.headers.get('user-agent') ?? '';
	if (ua.includes('Electron/') || ua.includes('floodilka-desktop/')) return 'desktop';
	if (ua.includes('okhttp/')) return 'android';
	if (/^Floodilka\//.test(ua) && (ua.includes('CFNetwork') || ua.includes('Darwin'))) return 'ios';
	return 'web';
}
