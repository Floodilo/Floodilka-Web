/*
 * SPDX-License-Identifier: AGPL-3.0-or-later
 * Copyright (C) 2020-2026 Fluxer Contributors
 * Copyright (C) 2026 Floodilka Contributors
 * Modified by Floodilka Contributors starting March 2026. See LICENSE and NOTICE.
 */

import SoundStore from '~/stores/SoundStore';
import type {SoundType} from '~/utils/SoundUtils';

export const playSound = (sound: SoundType, loop = false): void => {
	SoundStore.playSound(sound, loop);
};

export const stopAllSounds = (): void => {
	SoundStore.stopAllSounds();
};

export const updateSoundSettings = (settings: {
	allSoundsDisabled?: boolean;
	soundType?: SoundType;
	enabled?: boolean;
}): void => {
	SoundStore.updateSettings(settings);
};
