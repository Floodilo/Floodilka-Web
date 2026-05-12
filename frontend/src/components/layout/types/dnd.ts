/*
 * SPDX-License-Identifier: AGPL-3.0-or-later
 * Copyright (C) 2020-2026 Fluxer Contributors
 * Copyright (C) 2026 Floodilka Contributors
 * Modified by Floodilka Contributors starting March 2026. See LICENSE and NOTICE.
 */

export const DND_TYPES = {
	CHANNEL: 'channel',
	CATEGORY: 'category',
	VOICE_PARTICIPANT: 'voice-participant',
	GUILD_ITEM: 'guild-item',
	GUILD_FOLDER: 'guild-folder',
} as const;

export interface DragItem {
	type: string;
	id: string;
	channelType: number;
	parentId: string | null;
	guildId: string;
	userId?: string;
	currentChannelId?: string;
}

export interface DropResult {
	targetId: string;
	position: 'before' | 'after' | 'inside';
	targetParentId: string | null;
}

export interface GuildDragItem {
	type: typeof DND_TYPES.GUILD_ITEM | typeof DND_TYPES.GUILD_FOLDER;
	id: string;
	isFolder: boolean;
	folderId?: number | null;
}

export type GuildDropPosition = 'before' | 'after' | 'inside' | 'combine';

export interface GuildDropResult {
	targetId: string;
	position: GuildDropPosition;
	targetIsFolder: boolean;
	targetFolderId?: number | null;
}
