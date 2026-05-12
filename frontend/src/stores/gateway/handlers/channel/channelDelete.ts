/*
 * SPDX-License-Identifier: AGPL-3.0-or-later
 * Copyright (C) 2020-2026 Fluxer Contributors
 * Copyright (C) 2026 Floodilka Contributors
 * Modified by Floodilka Contributors starting March 2026. See LICENSE and NOTICE.
 */

import type {Channel} from '~/records/ChannelRecord';
import ChannelPinsStore from '~/stores/ChannelPinsStore';
import ChannelStore from '~/stores/ChannelStore';
import DraftStore from '~/stores/DraftStore';
import GuildReadStateStore from '~/stores/GuildReadStateStore';
import InviteStore from '~/stores/InviteStore';
import MessageStore from '~/stores/MessageStore';
import PermissionStore from '~/stores/PermissionStore';
import QuickSwitcherStore from '~/stores/QuickSwitcherStore';
import ReadStateStore from '~/stores/ReadStateStore';
import RecentMentionsStore from '~/stores/RecentMentionsStore';
import SavedMessagesStore from '~/stores/SavedMessagesStore';
import SelectedChannelStore from '~/stores/SelectedChannelStore';
import SlowmodeStore from '~/stores/SlowmodeStore';
import WebhookStore from '~/stores/WebhookStore';
import type {GatewayHandlerContext} from '../index';

interface ChannelDeletePayload {
	id: string;
	type: number;
	guild_id?: string;
}

export function handleChannelDelete(data: ChannelDeletePayload, _context: GatewayHandlerContext): void {
	const channel = data as Channel;
	const guildId = data.guild_id;

	SlowmodeStore.deleteChannel(data.id);
	DraftStore.deleteChannelDraft(data.id);
	SavedMessagesStore.handleChannelDelete(channel);
	ChannelPinsStore.handleChannelDelete(channel);
	ChannelStore.handleChannelDelete({channel});
	PermissionStore.handleChannelDelete(data.id, guildId);
	GuildReadStateStore.handleChannelDelete(data.id);
	InviteStore.handleChannelDelete(data.id);
	WebhookStore.handleChannelDelete(data.id);
	ReadStateStore.handleChannelDelete({channel});
	SelectedChannelStore.handleChannelDelete(channel);
	MessageStore.handleCleanup();
	RecentMentionsStore.handleChannelDelete(channel);
	QuickSwitcherStore.recomputeIfOpen();
}
