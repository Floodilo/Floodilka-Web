/*
 * SPDX-License-Identifier: AGPL-3.0-or-later
 * Copyright (C) 2020-2026 Fluxer Contributors
 * Copyright (C) 2026 Floodilka Contributors
 * Modified by Floodilka Contributors starting March 2026. See LICENSE and NOTICE.
 */

import React from 'react';
import type {GuildStickerRecord} from '~/records/GuildStickerRecord';
import GuildListStore from '~/stores/GuildListStore';
import StickerPickerStore from '~/stores/StickerPickerStore';

export const useStickerCategories = (
	allStickers: ReadonlyArray<GuildStickerRecord>,
	_renderedStickers: ReadonlyArray<GuildStickerRecord>,
) => {
	const guilds = GuildListStore.guilds;
	const stickerPickerState = StickerPickerStore;

	const favoriteStickers = React.useMemo(() => {
		return StickerPickerStore.getFavoriteStickers(allStickers);
	}, [allStickers, stickerPickerState.favoriteStickers]);

	const frequentlyUsedStickers = React.useMemo(() => {
		return StickerPickerStore.getFrecentStickers(allStickers, 42);
	}, [allStickers, stickerPickerState.stickerUsage]);

	const stickersByGuildId = React.useMemo(() => {
		const guildStickersMap = new Map<string, Array<GuildStickerRecord>>();

		for (const sticker of allStickers) {
			if (!guildStickersMap.has(sticker.guildId)) {
				guildStickersMap.set(sticker.guildId, []);
			}
			guildStickersMap.get(sticker.guildId)?.push(sticker);
		}

		const sortedGuildIds = guilds.map((guild) => guild.id);
		const sortedGuildStickersMap = new Map<string, ReadonlyArray<GuildStickerRecord>>();
		for (const guildId of sortedGuildIds) {
			if (guildStickersMap.has(guildId)) {
				sortedGuildStickersMap.set(guildId, guildStickersMap.get(guildId)!);
			}
		}

		return sortedGuildStickersMap;
	}, [allStickers, guilds]);

	return {
		favoriteStickers,
		frequentlyUsedStickers,
		stickersByGuildId,
	};
};
