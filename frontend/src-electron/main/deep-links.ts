/*
 * SPDX-License-Identifier: AGPL-3.0-or-later
 * Copyright (C) 2020-2026 Fluxer Contributors
 * Copyright (C) 2026 Floodilka Contributors
 * Modified by Floodilka Contributors starting March 2026. See LICENSE and NOTICE.
 */

import {app, ipcMain} from 'electron';
import {APP_PROTOCOL} from '../common/constants.js';
import {getMainWindow, showWindow} from './window.js';

let initialDeepLink: string | null = null;

export function initializeDeepLinks(): void {
	if (process.defaultApp) {
		if (process.argv.length >= 2) {
			app.setAsDefaultProtocolClient(APP_PROTOCOL, process.execPath, [process.argv[1]]);
		}
	} else {
		app.setAsDefaultProtocolClient(APP_PROTOCOL);
	}

	const deepLinkArg = process.argv.find((arg) => arg.startsWith(`${APP_PROTOCOL}://`));
	if (deepLinkArg) {
		initialDeepLink = deepLinkArg;
	}

	ipcMain.handle('get-initial-deep-link', (): string | null => {
		const url = initialDeepLink;
		initialDeepLink = null;
		return url;
	});
}

export function handleOpenUrl(url: string): void {
	const mainWindow = getMainWindow();

	if (mainWindow && !mainWindow.isDestroyed()) {
		mainWindow.webContents.send('deep-link', url);
		showWindow();
	} else {
		initialDeepLink = url;
	}
}

export function handleSecondInstance(argv: Array<string>): void {
	const url = argv.find((arg) => arg.startsWith(`${APP_PROTOCOL}://`));

	if (url) {
		const mainWindow = getMainWindow();
		if (mainWindow && !mainWindow.isDestroyed()) {
			mainWindow.webContents.send('deep-link', url);
			showWindow();
		} else {
			initialDeepLink = url;
		}
	} else {
		showWindow();
	}
}
