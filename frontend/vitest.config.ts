/*
 * SPDX-License-Identifier: AGPL-3.0-or-later
 * Copyright (C) 2020-2026 Fluxer Contributors
 * Copyright (C) 2026 Floodilka Contributors
 * Modified by Floodilka Contributors starting March 2026. See LICENSE and NOTICE.
 */

import path from 'node:path';
import {defineConfig} from 'vitest/config';

export default defineConfig({
	resolve: {
		alias: {
			'~': path.resolve(__dirname, './src'),
			'@pkgs': path.resolve(__dirname, './pkgs'),
		},
		extensions: ['.ts', '.tsx', '.js', '.jsx', '.json'],
	},
	test: {
		environment: 'happy-dom',
		setupFiles: ['./src/test/setup.ts'],
		globals: true,
		include: ['src/**/*.{test,spec}.{ts,tsx,js,jsx}'],
		coverage: {
			provider: 'v8',
			reporter: ['text', 'json', 'html'],
			exclude: ['node_modules/', '**/*.d.ts', '**/*.config.{js,ts}', 'src/test/**/*'],
		},
	},
});
