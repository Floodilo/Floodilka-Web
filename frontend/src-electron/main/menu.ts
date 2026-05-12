/*
 * SPDX-License-Identifier: AGPL-3.0-or-later
 * Copyright (C) 2020-2026 Fluxer Contributors
 * Copyright (C) 2026 Floodilka Contributors
 * Modified by Floodilka Contributors starting March 2026. See LICENSE and NOTICE.
 */

import {app, Menu, type MenuItemConstructorOptions, shell} from 'electron';
import {BUILD_CHANNEL} from '../common/build-channel.js';
import {getMainWindow} from './window.js';

export function createApplicationMenu(): void {
	const isCanary = BUILD_CHANNEL === 'canary';
	const appName = isCanary ? 'Флудилка Canary' : 'Флудилка';
	const isMac = process.platform === 'darwin';

	const template: Array<MenuItemConstructorOptions> = [];

	if (isMac) {
		app.setName(appName);

		template.push({
			label: appName,
			submenu: [
				{
					role: 'about',
					label: `About ${appName}`,
				},
				{type: 'separator'},
				{
					label: 'Preferences...',
					accelerator: 'Cmd+,',
					click: () => {
						const mainWindow = getMainWindow();
						if (mainWindow) {
							mainWindow.webContents.send('open-settings');
						}
					},
				},
				{type: 'separator'},
				{role: 'services'},
				{type: 'separator'},
				{
					role: 'hide',
					label: `Hide ${appName}`,
				},
				{role: 'hideOthers'},
				{role: 'unhide'},
				{type: 'separator'},
				{
					role: 'quit',
					label: `Quit ${appName}`,
				},
			],
		});
	}

	template.push({
		label: 'File',
		submenu: isMac
			? [{role: 'close'}]
			: [
					{
						label: 'Preferences',
						accelerator: 'Ctrl+,',
						click: () => {
							const mainWindow = getMainWindow();
							if (mainWindow) {
								mainWindow.webContents.send('open-settings');
							}
						},
					},
					{type: 'separator'},
					{role: 'quit'},
				],
	});

	template.push({
		label: 'Edit',
		submenu: [
			{role: 'undo'},
			{role: 'redo'},
			{type: 'separator'},
			{role: 'cut'},
			{role: 'copy'},
			{role: 'paste'},
			...(isMac
				? [
						{role: 'pasteAndMatchStyle' as const},
						{role: 'delete' as const},
						{role: 'selectAll' as const},
						{type: 'separator' as const},
						{
							label: 'Speech',
							submenu: [{role: 'startSpeaking' as const}, {role: 'stopSpeaking' as const}],
						},
					]
				: [{role: 'delete' as const}, {type: 'separator' as const}, {role: 'selectAll' as const}]),
		],
	});

	const zoomInHandler = () => {
		const mainWindow = getMainWindow();
		if (mainWindow) {
			mainWindow.webContents.send('zoom-in');
		}
	};

	template.push({
		label: 'View',
		submenu: [
			{role: 'reload'},
			{role: 'forceReload'},
			{role: 'toggleDevTools'},
			{type: 'separator'},
			{
				label: 'Actual Size',
				accelerator: 'CmdOrCtrl+0',
				click: () => {
					const mainWindow = getMainWindow();
					if (mainWindow) {
						mainWindow.webContents.send('zoom-reset');
					}
				},
			},
			{
				label: 'Zoom In',
				accelerator: 'CmdOrCtrl+Plus',
				click: zoomInHandler,
			},
			{
				label: 'Zoom In',
				accelerator: 'CmdOrCtrl+=',
				visible: false,
				click: zoomInHandler,
			},
			{
				label: 'Zoom Out',
				accelerator: 'CmdOrCtrl+-',
				click: () => {
					const mainWindow = getMainWindow();
					if (mainWindow) {
						mainWindow.webContents.send('zoom-out');
					}
				},
			},
			{type: 'separator'},
			{role: 'togglefullscreen'},
		],
	});

	template.push({
		label: 'Window',
		submenu: [
			{role: 'minimize'},
			{role: 'zoom'},
			...(isMac
				? [
						{type: 'separator' as const},
						{role: 'front' as const},
						{type: 'separator' as const},
						{role: 'window' as const},
					]
				: [{role: 'close' as const}]),
		],
	});

	template.push({
		label: 'Help',
		submenu: [
			{
				label: 'Website',
				click: async () => {
					await shell.openExternal('https://floodilka.com');
				},
			},
			],
	});

	const menu = Menu.buildFromTemplate(template);
	Menu.setApplicationMenu(menu);
}
