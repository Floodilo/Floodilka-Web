/*
 * SPDX-License-Identifier: AGPL-3.0-or-later
 * Copyright (C) 2020-2026 Fluxer Contributors
 * Copyright (C) 2026 Floodilka Contributors
 * Modified by Floodilka Contributors starting March 2026. See LICENSE and NOTICE.
 */

import {defineConfig} from 'vitest/config';
import path from 'path';

export default defineConfig({
	test: {
		globals: true,
		include: ['src/**/*.test.ts', 'services/**/*.test.js'],
	},
	resolve: {
		alias: {
			'~': path.resolve(__dirname, './src'),
		},
	},
});
