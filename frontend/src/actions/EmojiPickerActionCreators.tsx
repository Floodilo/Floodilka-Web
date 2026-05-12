/*
 * SPDX-License-Identifier: AGPL-3.0-or-later
 * Copyright (C) 2020-2026 Fluxer Contributors
 * Copyright (C) 2026 Floodilka Contributors
 * Modified by Floodilka Contributors starting March 2026. See LICENSE and NOTICE.
 */

import EmojiPickerStore from '~/stores/EmojiPickerStore';
import type {Emoji} from '~/stores/EmojiStore';

function getEmojiKey(emoji: Emoji): string {
	if (emoji.id) {
		return `custom:${emoji.guildId}:${emoji.id}`;
	}
	return `unicode:${emoji.uniqueName}`;
}

export function trackEmojiUsage(emoji: Emoji): void {
	EmojiPickerStore.trackEmojiUsage(getEmojiKey(emoji));
}

export function toggleFavorite(emoji: Emoji): void {
	EmojiPickerStore.toggleFavorite(getEmojiKey(emoji));
}

export function toggleCategory(category: string): void {
	EmojiPickerStore.toggleCategory(category);
}
