/*
 * SPDX-License-Identifier: AGPL-3.0-or-later
 * Copyright (C) 2020-2026 Fluxer Contributors
 * Copyright (C) 2026 Floodilka Contributors
 * Modified by Floodilka Contributors starting March 2026. See LICENSE and NOTICE.
 */

import type {Guild} from '~/records/GuildRecord';
import EmojiStore from '~/stores/EmojiStore';
import GuildAvailabilityStore from '~/stores/GuildAvailabilityStore';
import GuildListStore from '~/stores/GuildListStore';
import GuildStore from '~/stores/GuildStore';
import NagbarStore from '~/stores/NagbarStore';
import PermissionStore from '~/stores/PermissionStore';
import QuickSwitcherStore from '~/stores/QuickSwitcherStore';
import StickerStore from '~/stores/StickerStore';
import type {GatewayHandlerContext} from '../index';

export function handleGuildUpdate(data: Guild, _context: GatewayHandlerContext): void {
	GuildAvailabilityStore.setGuildAvailable(data.id);
	GuildStore.handleGuildUpdate(data);

	GuildListStore.handleGuild(data);
	StickerStore.handleGuildUpdate(data);
	NagbarStore.handleGuildUpdate({guild: data});
	EmojiStore.handleGuildUpdate({guild: data});
	PermissionStore.handleGuild();

	QuickSwitcherStore.recomputeIfOpen();
}
