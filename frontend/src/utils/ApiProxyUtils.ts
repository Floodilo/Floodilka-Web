/*
 * SPDX-License-Identifier: AGPL-3.0-or-later
 * Copyright (C) 2020-2026 Fluxer Contributors
 * Copyright (C) 2026 Floodilka Contributors
 * Modified by Floodilka Contributors starting March 2026. See LICENSE and NOTICE.
 */

const DEFAULT_HOSTS = new Set([
	'floodilka.com',
	'stage.floodilka.com',
	'api.floodilka.com',
	'localhost',
]);

const normalizeProxyPath = (path: string): string => {
	const trimmed = path.replace(/\/+$/, '');
	return trimmed === '' ? '/' : trimmed;
};

export function isElectronApiProxyUrl(raw: string): boolean {
	const base = getElectronApiProxyBaseUrl();
	if (!base) return false;

	try {
		const parsed = new URL(raw);
		if (parsed.origin !== base.origin) {
			return false;
		}

		const rawPath = normalizeProxyPath(parsed.pathname);
		const basePath = normalizeProxyPath(base.pathname);
		return rawPath === basePath;
	} catch {
		return false;
	}
}

export function isCustomInstanceUrl(url: string): boolean {
	try {
		const parsed = new URL(url);
		return !DEFAULT_HOSTS.has(parsed.hostname);
	} catch {
		return false;
	}
}

export function getElectronApiProxyBaseUrl(): URL | null {
	if (typeof window === 'undefined') {
		return null;
	}

	const getter = window.electron?.getApiProxyUrl;
	if (typeof getter !== 'function') {
		return null;
	}

	const raw = getter();
	if (!raw) return null;

	try {
		return new URL(raw);
	} catch {
		return null;
	}
}

export function wrapUrlWithElectronApiProxy(raw: string): string {
	const base = getElectronApiProxyBaseUrl();
	if (!base) return raw;
	if (isElectronApiProxyUrl(raw)) return raw;
	if (!isCustomInstanceUrl(raw)) return raw;

	const proxyUrl = new URL(base.toString());
	proxyUrl.searchParams.set('target', raw);
	return proxyUrl.toString();
}
