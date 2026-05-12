/*
 * SPDX-License-Identifier: AGPL-3.0-or-later
 * Copyright (C) 2020-2026 Fluxer Contributors
 * Copyright (C) 2026 Floodilka Contributors
 * Modified by Floodilka Contributors starting March 2026. See LICENSE and NOTICE.
 */

package integration

// SendVoiceStateUpdate sends a voice state update to the gateway
// Pass nil for guildID when joining DM/group DM calls
// Pass nil for channelID to disconnect from voice
func (g *gatewayClient) SendVoiceStateUpdate(guildID, channelID, connectionID *string, selfMute, selfDeaf, selfVideo, selfStream bool) {
	payload := map[string]any{
		"op": gatewayOpVoiceStateUpdate,
		"d": map[string]any{
			"guild_id":      guildID,
			"channel_id":    channelID,
			"connection_id": connectionID,
			"self_mute":     selfMute,
			"self_deaf":     selfDeaf,
			"self_video":    selfVideo,
			"self_stream":   selfStream,
		},
	}
	g.writeJSON(payload)
}
