/*
 * SPDX-License-Identifier: AGPL-3.0-or-later
 * Copyright (C) 2020-2026 Fluxer Contributors
 * Copyright (C) 2026 Floodilka Contributors
 * Modified by Floodilka Contributors starting March 2026. See LICENSE and NOTICE.
 */

import VoiceSettingsStore from '~/stores/VoiceSettingsStore';
import MediaEngineStore from '~/stores/voice/MediaEngineFacade';
import VoiceAudioContextManager from '~/stores/voice/VoiceAudioContextManager';

export const update = (
	settings: Partial<{
		inputDeviceId: string;
		outputDeviceId: string;
		videoDeviceId: string;
		inputVolume: number;
		outputVolume: number;
		cameraResolution: 'low' | 'medium' | 'high';
		screenshareResolution: 'low' | 'medium' | 'high';
		videoFrameRate: number;
		backgroundImageId: string;
		backgroundImages: Array<{id: string; createdAt: number}>;
		noiseSuppression: boolean;
		showGridView: boolean;
		showMyOwnCamera: boolean;
		showNonVideoParticipants: boolean;
	}>,
): void => {
	VoiceSettingsStore.updateSettings(settings);

	if (settings.outputDeviceId !== undefined) {
		VoiceAudioContextManager.setSinkId(VoiceSettingsStore.getOutputDeviceId());
	}

	if (settings.inputDeviceId !== undefined) {
		MediaEngineStore.applyInputDevice();
	}

	if (settings.outputVolume !== undefined) {
		MediaEngineStore.applyAllLocalAudioPreferences();
	}

	if (settings.inputVolume !== undefined) {
		MediaEngineStore.applyLocalInputVolume();
	}

	if (settings.noiseSuppression !== undefined) {
		MediaEngineStore.applyNoiseSuppression();
	}

	if (settings.videoFrameRate !== undefined || settings.cameraResolution !== undefined) {
		MediaEngineStore.applyVideoSettings();
	}
};
