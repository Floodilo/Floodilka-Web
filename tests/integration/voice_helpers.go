/*
 * SPDX-License-Identifier: AGPL-3.0-or-later
 * Copyright (C) 2020-2026 Fluxer Contributors
 * Copyright (C) 2026 Floodilka Contributors
 * Modified by Floodilka Contributors starting March 2026. See LICENSE and NOTICE.
 */

package integration

// Voice state and server update structures based on gateway protocol
type voiceServerUpdate struct {
	Token        string  `json:"token"`
	Endpoint     string  `json:"endpoint"`
	GuildID      *string `json:"guild_id"`
	ConnectionID string  `json:"connection_id"`
}

type voiceStateUpdate struct {
	UserID       string  `json:"user_id"`
	SessionID    string  `json:"session_id"`
	GuildID      *string `json:"guild_id"`
	ChannelID    *string `json:"channel_id"`
	ConnectionID string  `json:"connection_id"`
	SelfMute     bool    `json:"self_mute"`
	SelfDeaf     bool    `json:"self_deaf"`
	SelfVideo    bool    `json:"self_video"`
	SelfStream   bool    `json:"self_stream"`
	Mute         bool    `json:"mute"`
	Deaf         bool    `json:"deaf"`
	Video        bool    `json:"video"`
	Stream       bool    `json:"stream"`
}
