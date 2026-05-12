/*
 * SPDX-License-Identifier: AGPL-3.0-or-later
 * Copyright (C) 2020-2026 Fluxer Contributors
 * Copyright (C) 2026 Floodilka Contributors
 * Modified by Floodilka Contributors starting March 2026. See LICENSE and NOTICE.
 */

import path from 'node:path';
import {app} from 'electron';
import {BUILD_CHANNEL, type BuildChannel} from './build-channel.js';

interface UserDataPaths {
	readonly channel: BuildChannel;
	readonly directoryName: string;
	readonly base: string;
}

interface ChannelStorageDirectoryMap {
	stable: string;
	canary: string;
}

const channelStorageDirectoryMap: ChannelStorageDirectoryMap = {
	stable: 'floodilka',
	canary: 'floodilkacanary',
};

function resolveUserDataPaths(channel: BuildChannel): {directoryName: string; base: string} {
	const directoryName = channelStorageDirectoryMap[channel];
	const appDataPath = app.getPath('appData');
	const base = path.join(appDataPath, directoryName);

	return {
		directoryName,
		base,
	};
}

export function configureUserDataPath(): UserDataPaths {
	const channel = BUILD_CHANNEL;
	const {directoryName, base} = resolveUserDataPaths(channel);
	app.setPath('userData', base);

	return {
		channel,
		directoryName,
		base,
	};
}
