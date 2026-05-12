/*
 * SPDX-License-Identifier: AGPL-3.0-or-later
 * Copyright (C) 2020-2026 Fluxer Contributors
 * Copyright (C) 2026 Floodilka Contributors
 * Modified by Floodilka Contributors starting March 2026. See LICENSE and NOTICE.
 */

import fs from 'node:fs';
import path from 'node:path';
import {app, ipcMain} from 'electron';
import {BUILD_CHANNEL} from '../common/build-channel.js';

const AUTOSTART_INITIALIZED_FILE = 'autostart-initialized';

function getInitializedFilePath(): string {
	return path.join(app.getPath('userData'), AUTOSTART_INITIALIZED_FILE);
}

function isInitialized(): boolean {
	try {
		return fs.existsSync(getInitializedFilePath());
	} catch {
		return false;
	}
}

function markInitialized(): void {
	try {
		fs.writeFileSync(getInitializedFilePath(), '1', 'utf8');
	} catch {}
}

const isMac = process.platform === 'darwin';
const isWin = process.platform === 'win32';

function getAppName(): string {
	const isCanary = BUILD_CHANNEL === 'canary';
	return isCanary ? 'Флудилка Canary' : 'Флудилка';
}

// Squirrel.Windows: Update.exe is one directory up from app-X.Y.Z/
function getUpdateExePath(): string {
	return path.resolve(process.execPath, '..', '..', 'Update.exe');
}

function getSquirrelArgs(): Array<string> {
	return ['--processStart', `"${path.basename(process.execPath)}"`];
}

async function enableAutostart(): Promise<void> {
	if (isWin) {
		app.setLoginItemSettings({
			openAtLogin: true,
			path: getUpdateExePath(),
			args: getSquirrelArgs(),
		});
	} else if (isMac) {
		app.setLoginItemSettings({
			openAtLogin: true,
			openAsHidden: true,
			name: getAppName(),
		});
	}
}

async function disableAutostart(): Promise<void> {
	if (isWin) {
		app.setLoginItemSettings({
			openAtLogin: false,
			path: getUpdateExePath(),
			args: getSquirrelArgs(),
		});
	} else if (isMac) {
		app.setLoginItemSettings({
			openAtLogin: false,
			name: getAppName(),
			path: process.execPath,
		});
	}
}

async function isAutostartEnabled(): Promise<boolean> {
	if (isWin) {
		return app.getLoginItemSettings({
			path: getUpdateExePath(),
			args: getSquirrelArgs(),
		}).openAtLogin;
	}
	if (isMac) {
		return app.getLoginItemSettings({
			path: process.execPath,
		}).openAtLogin;
	}
	return false;
}

export function registerAutostartHandlers(): void {
	// Enable autostart by default on first launch
	if (!isInitialized()) {
		markInitialized();
		void enableAutostart();
	}

	ipcMain.handle('autostart-enable', async (): Promise<void> => {
		await enableAutostart();
	});

	ipcMain.handle('autostart-disable', async (): Promise<void> => {
		await disableAutostart();
	});

	ipcMain.handle('autostart-is-enabled', async (): Promise<boolean> => {
		return isAutostartEnabled();
	});

	ipcMain.handle('autostart-is-initialized', (): boolean => {
		return isInitialized();
	});

	ipcMain.handle('autostart-mark-initialized', (): void => {
		markInitialized();
	});
}
