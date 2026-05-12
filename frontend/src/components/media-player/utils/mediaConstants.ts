/*
 * SPDX-License-Identifier: AGPL-3.0-or-later
 * Copyright (C) 2020-2026 Fluxer Contributors
 * Copyright (C) 2026 Floodilka Contributors
 * Modified by Floodilka Contributors starting March 2026. See LICENSE and NOTICE.
 */

export const AUDIO_PLAYBACK_RATES = [0.5, 1, 1.25, 1.5, 2] as const;

export const VIDEO_PLAYBACK_RATES = [0.5, 1, 1.5, 2] as const;

export const DEFAULT_SEEK_AMOUNT = 10;

export const DEFAULT_VOLUME = 1;

export const VIDEO_BREAKPOINTS = {
	SMALL: 240,
	MEDIUM: 320,
	LARGE: 400,
} as const;

export const VOLUME_STEP = 0.1;

export const SEEK_STEP = 10;

export const VOLUME_STORAGE_KEY = 'floodilka:media-player:volume';

export const MUTE_STORAGE_KEY = 'floodilka:media-player:muted';

export const PLAYBACK_RATE_STORAGE_KEY = 'floodilka:media-player:playback-rate';
