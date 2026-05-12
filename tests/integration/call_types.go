/*
 * SPDX-License-Identifier: AGPL-3.0-or-later
 * Copyright (C) 2020-2026 Fluxer Contributors
 * Copyright (C) 2026 Floodilka Contributors
 * Modified by Floodilka Contributors starting March 2026. See LICENSE and NOTICE.
 */

package integration

// Call event types for gateway events

type callCreateEvent struct {
	ChannelID   string             `json:"channel_id"`
	MessageID   string             `json:"message_id"`
	Region      string             `json:"region"`
	Ringing     []string           `json:"ringing"`
	VoiceStates []voiceStateUpdate `json:"voice_states"`
}

type callUpdateEvent struct {
	ChannelID   string             `json:"channel_id"`
	MessageID   string             `json:"message_id"`
	Region      string             `json:"region"`
	Ringing     []string           `json:"ringing"`
	VoiceStates []voiceStateUpdate `json:"voice_states"`
}

type callDeleteEvent struct {
	ChannelID   string `json:"channel_id"`
	Unavailable bool   `json:"unavailable,omitempty"`
}

// Message call object embedded in message responses
type messageCallObject struct {
	Participants   []string `json:"participants"`
	EndedTimestamp *string  `json:"ended_timestamp"`
}

// Full message response with call object
type callMessageResponse struct {
	ID        string             `json:"id"`
	Type      int                `json:"type"`
	ChannelID string             `json:"channel_id"`
	AuthorID  string             `json:"author_id"`
	Content   string             `json:"content"`
	Call      *messageCallObject `json:"call,omitempty"`
}

// Call eligibility response
type callEligibilityResponse struct {
	Ringable bool `json:"ringable"`
	Silent   bool `json:"silent,omitempty"`
}
