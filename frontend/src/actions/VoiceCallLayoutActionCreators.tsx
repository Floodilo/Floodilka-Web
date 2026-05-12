/*
 * SPDX-License-Identifier: AGPL-3.0-or-later
 * Copyright (C) 2020-2026 Fluxer Contributors
 * Copyright (C) 2026 Floodilka Contributors
 * Modified by Floodilka Contributors starting March 2026. See LICENSE and NOTICE.
 */

import type {LayoutMode} from '~/stores/VoiceCallLayoutStore';
import VoiceCallLayoutStore from '~/stores/VoiceCallLayoutStore';

export const setLayoutMode = (mode: LayoutMode): void => {
	VoiceCallLayoutStore.setLayoutMode(mode);
};

export const setPinnedParticipant = (identity: string | null): void => {
	VoiceCallLayoutStore.setPinnedParticipant(identity);
};

export const markUserOverride = (): void => {
	VoiceCallLayoutStore.markUserOverride();
};
