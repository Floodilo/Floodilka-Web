/*
 * SPDX-License-Identifier: AGPL-3.0-or-later
 * Copyright (C) 2020-2026 Fluxer Contributors
 * Copyright (C) 2026 Floodilka Contributors
 * Modified by Floodilka Contributors starting March 2026. See LICENSE and NOTICE.
 */

import {execSync} from 'node:child_process';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import * as esbuild from 'esbuild';

const scriptDir = path.dirname(fileURLToPath(import.meta.url));
const projectRoot = path.resolve(scriptDir, '..');

const allowedChannels = new Set(['stable', 'canary']);
const rawChannel = process.env.BUILD_CHANNEL?.toLowerCase() ?? '';
const channel = allowedChannels.has(rawChannel) ? rawChannel : 'stable';

console.log(`Building Electron with channel: ${channel}`);

execSync('node scripts/set-build-channel.mjs', {cwd: projectRoot, stdio: 'inherit'});

execSync('npx tsc -p tsconfig.electron.json', {cwd: projectRoot, stdio: 'inherit'});

await esbuild.build({
	entryPoints: [path.join(projectRoot, 'src-electron/preload/index.ts')],
	bundle: true,
	platform: 'node',
	target: 'node18',
	format: 'cjs',
	outfile: path.join(projectRoot, 'src-electron/dist/preload/index.js'),
	external: ['electron'],
	define: {
		'process.env.BUILD_CHANNEL': JSON.stringify(channel),
	},
	sourcemap: true,
});

console.log('Electron build complete');
