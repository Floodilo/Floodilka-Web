/*
 * SPDX-License-Identifier: AGPL-3.0-or-later
 * Copyright (C) 2020-2026 Fluxer Contributors
 * Copyright (C) 2026 Floodilka Contributors
 * Modified by Floodilka Contributors starting March 2026. See LICENSE and NOTICE.
 */

import {makeAutoObservable, observable} from 'mobx';
import type {GuildStickerRecord} from '~/records/GuildStickerRecord';

class ChannelStickerStore {
	pendingStickers: Map<string, GuildStickerRecord> = observable.map();

	constructor() {
		makeAutoObservable(
			this,
			{
				pendingStickers: false,
			},
			{autoBind: true},
		);
	}

	setPendingSticker(channelId: string, sticker: GuildStickerRecord): void {
		this.pendingStickers.set(channelId, sticker);
	}

	removePendingSticker(channelId: string): void {
		this.pendingStickers.delete(channelId);
	}

	clearPendingStickerOnMessageSend(channelId: string): void {
		if (this.pendingStickers.has(channelId)) {
			this.pendingStickers.delete(channelId);
		}
	}

	getPendingSticker(channelId: string): GuildStickerRecord | null {
		return this.pendingStickers.get(channelId) ?? null;
	}
}

export default new ChannelStickerStore();
