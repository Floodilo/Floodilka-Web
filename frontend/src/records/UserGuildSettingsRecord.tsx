/*
 * SPDX-License-Identifier: AGPL-3.0-or-later
 * Copyright (C) 2020-2026 Fluxer Contributors
 * Copyright (C) 2026 Floodilka Contributors
 * Modified by Floodilka Contributors starting March 2026. See LICENSE and NOTICE.
 */

export type MuteConfig = Readonly<{
	end_time?: string | null;
	selected_time_window?: number;
}> | null;

export type ChannelOverride = Readonly<{
	collapsed: boolean;
	message_notifications: number;
	muted: boolean;
	mute_config?: MuteConfig;
}>;

export type UserGuildSettings = Readonly<{
	guild_id: string | null;
	message_notifications: number;
	muted: boolean;
	mute_config?: MuteConfig;
	mobile_push: boolean;
	suppress_everyone: boolean;
	suppress_roles: boolean;
	hide_muted_channels: boolean;
	channel_overrides?: Record<string, ChannelOverride> | null;
	version: number;
}>;

export type UserGuildSettingsPartial = Partial<Omit<UserGuildSettings, 'guild_id' | 'version'>>;
