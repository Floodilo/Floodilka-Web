/*
 * SPDX-License-Identifier: AGPL-3.0-or-later
 * Copyright (C) 2020-2026 Fluxer Contributors
 * Copyright (C) 2026 Floodilka Contributors
 * Modified by Floodilka Contributors starting March 2026. See LICENSE and NOTICE.
 */

import {describe, expect, it} from 'vitest';
import {OAuth2RedirectURICreateType, OAuth2RedirectURIUpdateType} from './OAuth2RedirectURI';

const loopbackRedirects = [
	'https://example.com/callback',
	'https://example.com/callback?foo=bar',
	'http://localhost:3000/callback',
	'http://127.0.0.1/callback',
	'http://[::1]/callback',
	'http://foo.localhost/callback',
];

const deniedProtocols = [
	'javascript://example.com/%0Aalert(1)',
	'data://example.com/text',
	'file://example.com/etc/passwd',
	'vbscript://example.com/code',
	'ftp://example.com/file',
	'ws://example.com/socket',
	'wss://example.com/socket',
	'custom://example.com/path',
];

describe('OAuth2 redirect URI validation', () => {
	describe('create redirect URI type', () => {
		it('allows secure redirect URIs', () => {
			for (const redirect of loopbackRedirects) {
				const result = OAuth2RedirectURICreateType.safeParse(redirect);
				expect(result.success).toBe(true);
			}
		});

		it('rejects non-localhost http hosts', () => {
			const result = OAuth2RedirectURICreateType.safeParse('http://example.com/callback');
			expect(result.success).toBe(false);
		});

		for (const entry of deniedProtocols) {
			it(`rejects ${entry.split('://')[0]} protocols`, () => {
				const result = OAuth2RedirectURICreateType.safeParse(entry);
				expect(result.success).toBe(false);
			});
		}
	});

	describe('update redirect URI type', () => {
		it('allows http redirects for all hosts', () => {
			const result = OAuth2RedirectURIUpdateType.safeParse('http://example.com/callback');
			expect(result.success).toBe(true);
		});

		for (const redirect of loopbackRedirects) {
			it(`still allows ${redirect} redirects`, () => {
				const result = OAuth2RedirectURIUpdateType.safeParse(redirect);
				expect(result.success).toBe(true);
			});
		}

		for (const entry of deniedProtocols) {
			it(`rejects ${entry.split('://')[0]} protocols`, () => {
				const result = OAuth2RedirectURIUpdateType.safeParse(entry);
				expect(result.success).toBe(false);
			});
		}
	});
});
