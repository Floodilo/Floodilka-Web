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

import {spawn} from 'node:child_process';
import fs from 'node:fs/promises';
import http from 'node:http';
import net from 'node:net';
import {createRequire} from 'node:module';
import os from 'node:os';
import path from 'node:path';
import {fileURLToPath} from 'node:url';

const require = createRequire(import.meta.url);
const scriptDir = path.dirname(fileURLToPath(import.meta.url));
const projectRoot = path.resolve(scriptDir, '..');
const buildChannelPath = path.join(projectRoot, 'src-electron', 'common', 'build-channel.ts');
const electronPath = require('electron');
const pnpmCommand = process.platform === 'win32' ? 'pnpm.cmd' : 'pnpm';

const buildChannel = process.env.BUILD_CHANNEL ?? 'canary';
const bootstrapApiEndpoint = process.env.PUBLIC_BOOTSTRAP_API_ENDPOINT ?? 'https://floodilka.com/api';
const devSessionId = process.env.FLOODILKA_DEV_SESSION_ID ?? String(process.pid);
const devUserDataDir =
	process.env.FLOODILKA_DEV_USER_DATA_DIR ?? path.join(os.tmpdir(), 'floodilka-electron-dev', devSessionId);

let devServer = null;
let electronProcess = null;
let isShuttingDown = false;

function spawnChild(command, args, options = {}) {
	const shell = process.platform === 'win32' && command.endsWith('.cmd');
	const child = spawn(command, args, {
		cwd: projectRoot,
		env: process.env,
		stdio: 'inherit',
		shell,
		...options,
	});

	child.on('error', (error) => {
		console.error(`Failed to start ${command}:`, error);
		shutdown(1);
	});

	return child;
}

function run(command, args, options = {}) {
	return new Promise((resolve, reject) => {
		const child = spawnChild(command, args, options);
		child.on('exit', (code, signal) => {
			if (signal) {
				reject(new Error(`${command} exited with signal ${signal}`));
				return;
			}
			if (code === 0) {
				resolve();
				return;
			}
			reject(new Error(`${command} exited with code ${code ?? 'unknown'}`));
		});
	});
}

function isPortFree(port) {
	return new Promise((resolve) => {
		const server = net.createServer();
		server.once('error', () => resolve(false));
		server.once('listening', () => {
			server.close(() => resolve(true));
		});
		server.listen(port, '127.0.0.1');
	});
}

async function findFreePort(startPort) {
	for (let port = startPort; port < startPort + 50; port += 1) {
		if (await isPortFree(port)) {
			return port;
		}
	}
	throw new Error(`No free localhost port found starting at ${startPort}`);
}

function fetchOk(url) {
	return new Promise((resolve) => {
		const req = http.get(url, (res) => {
			res.resume();
			resolve((res.statusCode ?? 0) >= 200 && (res.statusCode ?? 0) < 500);
		});
		req.setTimeout(1000, () => {
			req.destroy();
			resolve(false);
		});
		req.on('error', () => resolve(false));
	});
}

async function waitForUrl(url) {
	const startedAt = Date.now();
	while (Date.now() - startedAt < 120000) {
		if (await fetchOk(url)) {
			return;
		}
		await new Promise((resolve) => setTimeout(resolve, 500));
	}
	throw new Error(`Timed out waiting for frontend dev server at ${url}`);
}

function terminateProcessTree(child) {
	if (!child || child.killed) return;

	if (process.platform === 'win32' && child.pid) {
		spawn('taskkill', ['/PID', String(child.pid), '/T', '/F'], {stdio: 'ignore'});
		return;
	}

	child.kill('SIGTERM');
}

function shutdown(code = 0) {
	if (isShuttingDown) return;
	isShuttingDown = true;
	terminateProcessTree(electronProcess);
	terminateProcessTree(devServer);
	process.exit(code);
}

process.on('SIGINT', () => shutdown(130));
process.on('SIGTERM', () => shutdown(143));

try {
	console.log(`Building Electron dev shell (${buildChannel})...`);
	const buildChannelSource = await fs.readFile(buildChannelPath, 'utf8').catch(() => null);
	try {
		await run('node', ['scripts/build-electron.mjs'], {
			env: {
				...process.env,
				BUILD_CHANNEL: buildChannel,
			},
		});
	} finally {
		if (buildChannelSource !== null) {
			await fs.writeFile(buildChannelPath, buildChannelSource);
		}
	}

	const configuredAppUrl = process.env.FLOODILKA_DESKTOP_APP_URL;
	const port = configuredAppUrl ? Number(new URL(configuredAppUrl).port) : await findFreePort(3000);
	const appUrl = configuredAppUrl ?? `http://127.0.0.1:${port}`;
	const runtimePorts = {
		FLOODILKA_API_PROXY_PORT: process.env.FLOODILKA_API_PROXY_PORT ?? String(await findFreePort(22861)),
		FLOODILKA_RPC_PORT: process.env.FLOODILKA_RPC_PORT ?? String(await findFreePort(22863)),
		FLOODILKA_WS_PROXY_PORT: process.env.FLOODILKA_WS_PROXY_PORT ?? String(await findFreePort(22865)),
		FLOODILKA_MEDIA_PROXY_PORT: process.env.FLOODILKA_MEDIA_PROXY_PORT ?? String(await findFreePort(22867)),
	};

	console.log(`Starting frontend dev server at ${appUrl}`);
	devServer = spawnChild(pnpmCommand, ['exec', 'rspack', 'serve', '--host', '127.0.0.1', '--port', String(port)], {
		env: {
			...process.env,
			NODE_ENV: 'development',
			PUBLIC_BOOTSTRAP_API_ENDPOINT: bootstrapApiEndpoint,
			PUBLIC_BOOTSTRAP_API_PUBLIC_ENDPOINT: bootstrapApiEndpoint,
		},
	});

	await waitForUrl(appUrl);

	console.log(`Starting Electron against ${appUrl}`);
	console.log(`Using Electron user data at ${devUserDataDir}`);
	console.log(`Using local API proxy at http://127.0.0.1:${runtimePorts.FLOODILKA_API_PROXY_PORT}/proxy`);
	electronProcess = spawnChild(electronPath, ['.'], {
		env: {
			...process.env,
			...runtimePorts,
			BUILD_CHANNEL: buildChannel,
			NODE_ENV: 'development',
			FLOODILKA_DESKTOP_APP_URL: appUrl,
			FLOODILKA_DEV_USER_DATA_DIR: devUserDataDir,
			FLOODILKA_OPEN_DEVTOOLS: process.env.FLOODILKA_OPEN_DEVTOOLS ?? '1',
		},
	});

	electronProcess.on('exit', (code) => {
		terminateProcessTree(devServer);
		process.exit(code ?? 0);
	});
} catch (error) {
	console.error(error instanceof Error ? error.message : error);
	shutdown(1);
}
