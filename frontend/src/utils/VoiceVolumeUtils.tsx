/*
 * SPDX-License-Identifier: AGPL-3.0-or-later
 * Copyright (C) 2020-2026 Fluxer Contributors
 * Copyright (C) 2026 Floodilka Contributors
 * Modified by Floodilka Contributors starting March 2026. See LICENSE and NOTICE.
 */

export const MAX_VOICE_VOLUME_PERCENT = 200;
export const MAX_VOICE_TRACK_GAIN = MAX_VOICE_VOLUME_PERCENT / 100;

export function clampVoiceVolumePercent(value: number): number {
	if (!Number.isFinite(value)) {
		return 100;
	}
	return Math.max(0, Math.min(MAX_VOICE_VOLUME_PERCENT, value));
}

export function voiceVolumePercentToCappedVolume(value: number): number {
	return Math.max(0, Math.min(1, clampVoiceVolumePercent(value) / 100));
}

export function voiceVolumePercentToBoostedGain(value: number): number {
	return Math.max(0, Math.min(MAX_VOICE_TRACK_GAIN, clampVoiceVolumePercent(value) / 100));
}

export function composeVolumePercent(...volumeParts: Array<number>): number {
	const composed = volumeParts.reduce((accumulator, currentValue) => {
		return accumulator * (clampVoiceVolumePercent(currentValue) / 100);
	}, 100);
	return clampVoiceVolumePercent(composed);
}
