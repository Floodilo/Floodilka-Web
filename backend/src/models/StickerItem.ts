/*
 * SPDX-License-Identifier: AGPL-3.0-or-later
 * Copyright (C) 2020-2026 Fluxer Contributors
 * Copyright (C) 2026 Floodilka Contributors
 * Modified by Floodilka Contributors starting March 2026. See LICENSE and NOTICE.
 */

import type {MessageStickerItem} from '~/database/CassandraTypes';
import type {StickerID} from '../BrandedTypes';

export class StickerItem {
	readonly id: StickerID;
	readonly name: string;
	readonly formatType: number;

	constructor(sticker: MessageStickerItem) {
		this.id = sticker.sticker_id;
		this.name = sticker.name;
		this.formatType = sticker.format_type;
	}

	toMessageStickerItem(): MessageStickerItem {
		return {
			sticker_id: this.id,
			name: this.name,
			format_type: this.formatType,
		};
	}
}
