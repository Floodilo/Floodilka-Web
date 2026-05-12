/*
 * SPDX-License-Identifier: AGPL-3.0-or-later
 * Copyright (C) 2020-2026 Fluxer Contributors
 * Copyright (C) 2026 Floodilka Contributors
 * Modified by Floodilka Contributors starting March 2026. See LICENSE and NOTICE.
 */

import type {GuildStickerRecord} from '~/records/GuildStickerRecord';
import ChannelStickerStore from '~/stores/ChannelStickerStore';

export function setPendingSticker(channelId: string, sticker: GuildStickerRecord): void {
	ChannelStickerStore.setPendingSticker(channelId, sticker);
}

export function removePendingSticker(channelId: string): void {
	ChannelStickerStore.removePendingSticker(channelId);
}
