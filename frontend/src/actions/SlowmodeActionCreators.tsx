/*
 * SPDX-License-Identifier: AGPL-3.0-or-later
 * Copyright (C) 2020-2026 Fluxer Contributors
 * Copyright (C) 2026 Floodilka Contributors
 * Modified by Floodilka Contributors starting March 2026. See LICENSE and NOTICE.
 */

import ChannelStickerStore from '~/stores/ChannelStickerStore';
import SlowmodeStore from '~/stores/SlowmodeStore';

export function recordMessageSend(channelId: string): void {
	ChannelStickerStore.clearPendingStickerOnMessageSend(channelId);
	SlowmodeStore.recordMessageSend(channelId);
}

export function updateSlowmodeTimestamp(channelId: string, timestamp: number): void {
	SlowmodeStore.updateSlowmodeTimestamp(channelId, timestamp);
}
