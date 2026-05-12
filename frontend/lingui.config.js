/*
 * SPDX-License-Identifier: AGPL-3.0-or-later
 * Copyright (C) 2020-2026 Fluxer Contributors
 * Copyright (C) 2026 Floodilka Contributors
 * Modified by Floodilka Contributors starting March 2026. See LICENSE and NOTICE.
 */

module.exports = {
	locales: ['en-US', 'ru'],
	sourceLocale: 'en-US',
	catalogs: [
		{
			path: 'src/locales/{locale}/messages',
			include: ['src'],
			exclude: ['**/node_modules/**', '**/*.d.ts'],
		},
	],
	format: 'po',
	compileNamespace: 'es',
};
