/*
 * SPDX-License-Identifier: AGPL-3.0-or-later
 * Copyright (C) 2020-2026 Fluxer Contributors
 * Copyright (C) 2026 Floodilka Contributors
 * Modified by Floodilka Contributors starting March 2026. See LICENSE and NOTICE.
 */

import {Logger} from '~/lib/Logger';
import {mediaDeviceCache} from '~/lib/MediaDeviceCache';
import VoiceDevicePermissionStore from '~/stores/voice/VoiceDevicePermissionStore';

const logger = new Logger('MediaDeviceRefresh');

export enum MediaDeviceRefreshType {
	audio = 'audio',
	video = 'video',
}

export interface RefreshMediaDeviceListsOptions {
	type: MediaDeviceRefreshType;
}

export const refreshMediaDeviceLists = async (options: RefreshMediaDeviceListsOptions): Promise<void> => {
	const {type} = options;
	mediaDeviceCache.invalidate(type);
	try {
		await VoiceDevicePermissionStore.ensureDevices({requestPermissions: true});
	} catch (error) {
		logger.error('Failed to refresh media device lists', error);
	}
};
