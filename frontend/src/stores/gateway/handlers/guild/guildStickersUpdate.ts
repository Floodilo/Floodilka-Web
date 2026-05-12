/*
 * SPDX-License-Identifier: AGPL-3.0-or-later
 * Copyright (C) 2020-2026 Fluxer Contributors
 * Copyright (C) 2026 Floodilka Contributors
 * Modified by Floodilka Contributors starting March 2026. See LICENSE and NOTICE.
 */

import type {GuildSticker} from '~/records/GuildStickerRecord';
import StickerStore from '~/stores/StickerStore';
import type {GatewayHandlerContext} from '../index';

interface GuildStickersUpdatePayload {
	guild_id: string;
	stickers: ReadonlyArray<GuildSticker>;
}

export function handleGuildStickersUpdate(data: GuildStickersUpdatePayload, _context: GatewayHandlerContext): void {
	StickerStore.handleGuildStickersUpdate(data.guild_id, data.stickers);
}
