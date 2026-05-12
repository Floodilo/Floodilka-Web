/*
 * SPDX-License-Identifier: AGPL-3.0-or-later
 * Copyright (C) 2020-2026 Fluxer Contributors
 * Copyright (C) 2026 Floodilka Contributors
 * Modified by Floodilka Contributors starting March 2026. See LICENSE and NOTICE.
 */

import type {GuildStickerRecord} from '~/records/GuildStickerRecord';
import StickerPickerStore from '~/stores/StickerPickerStore';

function getStickerKey(sticker: GuildStickerRecord): string {
	return `${sticker.guildId}:${sticker.id}`;
}

export function trackStickerUsage(sticker: GuildStickerRecord): void {
	StickerPickerStore.trackStickerUsage(getStickerKey(sticker));
}

export function toggleFavorite(sticker: GuildStickerRecord): void {
	StickerPickerStore.toggleFavorite(getStickerKey(sticker));
}

export function toggleCategory(category: string): void {
	StickerPickerStore.toggleCategory(category);
}
