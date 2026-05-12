/*
 * SPDX-License-Identifier: AGPL-3.0-or-later
 * Copyright (C) 2020-2026 Fluxer Contributors
 * Copyright (C) 2026 Floodilka Contributors
 * Modified by Floodilka Contributors starting March 2026. See LICENSE and NOTICE.
 */

import {afterEach, describe, expect, test} from 'vitest';
import {isCustomInstanceUrl, isElectronApiProxyUrl, wrapUrlWithElectronApiProxy} from './ApiProxyUtils';

const ELECTRON_API_PROXY_BASE = 'http://127.0.0.1:21862/proxy';

const setElectronApiProxy = () => {
	Object.defineProperty(window, 'electron', {
		value: {
			getApiProxyUrl: () => ELECTRON_API_PROXY_BASE,
		},
		writable: true,
		configurable: true,
	});
};

const clearElectron = () => {
	Object.defineProperty(window, 'electron', {
		value: undefined,
		writable: true,
		configurable: true,
	});
};

afterEach(() => {
	clearElectron();
});

describe('ApiProxyUtils (Electron API proxy wrapping)', () => {
	test('detects custom instances outside the default list', () => {
		const url = 'https://self-hosted.example/api';
		expect(isCustomInstanceUrl(url)).toBe(true);
	});

	test('ignores default Floodilka hosts', () => {
		const url = 'https://floodilka.com/api/v1';
		expect(isCustomInstanceUrl(url)).toBe(false);
	});

	test('recognizes the electron proxy URL (including query params)', () => {
		setElectronApiProxy();

		const wrapped = `${ELECTRON_API_PROXY_BASE}?target=https://self-hosted.example/api`;
		expect(isElectronApiProxyUrl(ELECTRON_API_PROXY_BASE)).toBe(true);
		expect(isElectronApiProxyUrl(wrapped)).toBe(true);
		expect(isElectronApiProxyUrl('https://self-hosted.example/api')).toBe(false);
	});

	test('wraps custom hosts but skips already wrapped URLs', () => {
		setElectronApiProxy();

		const target = 'https://self-hosted.example/api';
		const wrapped = wrapUrlWithElectronApiProxy(target);
		const parsed = new URL(wrapped);
		expect(parsed.origin).toBe('http://127.0.0.1:21862');
		expect(parsed.pathname).toBe('/proxy');
		expect(parsed.searchParams.get('target')).toBe(target);

		const alreadyWrapped = wrapUrlWithElectronApiProxy(wrapped);
		expect(alreadyWrapped).toBe(wrapped);
	});
});
