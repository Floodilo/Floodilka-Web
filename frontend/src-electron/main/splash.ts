/*
 * SPDX-License-Identifier: AGPL-3.0-or-later
 * Copyright (C) 2020-2026 Fluxer Contributors
 * Copyright (C) 2026 Floodilka Contributors
 * Modified by Floodilka Contributors starting March 2026. See LICENSE and NOTICE.
 */

import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {app, BrowserWindow} from 'electron';
import log from 'electron-log';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

let splashWindow: BrowserWindow | null = null;

export function createSplashWindow(): BrowserWindow {
	splashWindow = new BrowserWindow({
		width: 300,
		height: 350,
		frame: false,
		transparent: false,
		resizable: false,
		movable: true,
		center: true,
		alwaysOnTop: true,
		skipTaskbar: true,
		backgroundColor: '#0F0C10',
		webPreferences: {
			contextIsolation: true,
			nodeIntegration: false,
			sandbox: true,
		},
	});

	const splashPath = app.isPackaged
		? path.join(process.resourcesPath, 'splash.html')
		: path.join(__dirname, '../../assets/splash.html');

	splashWindow.loadFile(splashPath).catch((error) => {
		log.error('[Splash] Failed to load splash.html:', error);
	});

	splashWindow.once('ready-to-show', () => {
		splashWindow?.show();
		setSplashVersion(app.getVersion());

		const logoPath = app.isPackaged
			? path.join(process.resourcesPath, 'logo_nobg.png')
			: path.join(__dirname, '../../../public/icons/logo_nobg.png');
		const logoUrl = `file://${logoPath.replace(/\\/g, '/')}`;
		executeOnSplash(`document.querySelector('.spinner-logo img').src = '${logoUrl}'`);
	});

	splashWindow.on('closed', () => {
		splashWindow = null;
	});

	return splashWindow;
}

export function getSplashWindow(): BrowserWindow | null {
	return splashWindow;
}

export function closeSplashWindow(): void {
	if (splashWindow && !splashWindow.isDestroyed()) {
		splashWindow.close();
		splashWindow = null;
	}
}

function executeOnSplash(js: string): void {
	if (splashWindow && !splashWindow.isDestroyed()) {
		splashWindow.webContents.executeJavaScript(js).catch(() => {});
	}
}

export function setSplashStatus(text: string): void {
	const escaped = text.replace(/'/g, "\\'");
	executeOnSplash(`document.getElementById('statusText').textContent = '${escaped}'`);
}

export function setSplashProgress(percent: number): void {
	executeOnSplash(`
		const bar = document.getElementById('progressBar');
		bar.classList.add('determinate');
		bar.style.width = '${Math.round(percent)}%';
	`);
}

export function setSplashProgressIndeterminate(): void {
	executeOnSplash(`
		const bar = document.getElementById('progressBar');
		bar.classList.remove('determinate');
		bar.style.width = '30%';
	`);
}

function setSplashVersion(version: string): void {
	const escaped = version.replace(/'/g, "\\'");
	executeOnSplash(`document.getElementById('version').textContent = 'v${escaped}'`);
}
