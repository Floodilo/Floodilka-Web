/*
 * Copyright (C) 2026 Floodilka Contributors
 *
 * This file is part of Floodilka.
 *
 * Floodilka is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * Floodilka is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
 * GNU Affero General Public License for more details.
 *
 * You should have received a copy of the GNU Affero General Public License
 * along with Floodilka. If not, see <https://www.gnu.org/licenses/>.
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

function isLocalDesktopDevOrigin(): boolean {
	if (typeof window === 'undefined') return false;
	if (!window.electron?.getApiProxyUrl) return false;

	const {hostname, protocol} = window.location;
	return protocol === 'http:' && (hostname === 'localhost' || hostname === '127.0.0.1' || hostname === '::1');
}

export function shouldUseElectronApiProxy(raw: string): boolean {
	if (isElectronApiProxyUrl(raw)) return false;
	if (isCustomInstanceUrl(raw)) return true;
	return isLocalDesktopDevOrigin();
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
	if (!shouldUseElectronApiProxy(raw)) return raw;

	const proxyUrl = new URL(base.toString());
	proxyUrl.searchParams.set('target', raw);
	return proxyUrl.toString();
}
