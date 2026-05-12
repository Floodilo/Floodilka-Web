/*
 * SPDX-License-Identifier: AGPL-3.0-or-later
 * Copyright (C) 2020-2026 Fluxer Contributors
 * Copyright (C) 2026 Floodilka Contributors
 * Modified by Floodilka Contributors starting March 2026. See LICENSE and NOTICE.
 */

import {makeAutoObservable} from 'mobx';
import {makePersistent} from '~/lib/MobXPersistence';

export type EmojiLayout = 'list' | 'grid';
export type StickerViewMode = 'cozy' | 'compact';

class EmojiStickerLayoutStore {
	emojiLayout: EmojiLayout = 'list';
	stickerViewMode: StickerViewMode = 'cozy';

	constructor() {
		makeAutoObservable(this, {}, {autoBind: true});
		void this.initPersistence();
	}

	private async initPersistence(): Promise<void> {
		await makePersistent(this, 'EmojiStickerLayoutStore', ['emojiLayout', 'stickerViewMode']);
	}

	getEmojiLayout(): EmojiLayout {
		return this.emojiLayout;
	}

	setEmojiLayout(layout: EmojiLayout): void {
		this.emojiLayout = layout;
	}

	getStickerViewMode(): StickerViewMode {
		return this.stickerViewMode;
	}

	setStickerViewMode(mode: StickerViewMode): void {
		this.stickerViewMode = mode;
	}
}

export default new EmojiStickerLayoutStore();
