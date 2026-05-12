/*
 * SPDX-License-Identifier: AGPL-3.0-or-later
 * Copyright (C) 2020-2026 Fluxer Contributors
 * Copyright (C) 2026 Floodilka Contributors
 * Modified by Floodilka Contributors starting March 2026. See LICENSE and NOTICE.
 */

import fs from 'node:fs';
import path from 'node:path';
import {app, Menu, nativeImage, Tray} from 'electron';
import log from 'electron-log';
import {showWindow} from './window.js';

let tray: Tray | null = null;

function getTrayIcon(): Electron.NativeImage {
	const iconPath = path.join(process.resourcesPath, '512x512.png');

	if (!fs.existsSync(iconPath)) {
		log.warn('[Tray] Icon not found at', iconPath, '— using empty image');
		return nativeImage.createEmpty();
	}

	const icon = nativeImage.createFromPath(iconPath);
	return icon.resize({width: 16, height: 16});
}

export function createTray(): void {
	if (process.platform === 'darwin') {
		return;
	}

	if (tray) {
		return;
	}

	const icon = getTrayIcon();
	tray = new Tray(icon);
	tray.setToolTip('Флудилка');

	const contextMenu = Menu.buildFromTemplate([
		{
			label: 'Показать',
			click: () => {
				showWindow();
			},
		},
		{type: 'separator'},
		{
			label: 'Выход',
			click: () => {
				app.quit();
			},
		},
	]);

	tray.setContextMenu(contextMenu);

	tray.on('double-click', () => {
		showWindow();
	});

	log.info('[Tray] System tray created');
}

export function destroyTray(): void {
	if (tray) {
		tray.destroy();
		tray = null;
	}
}
