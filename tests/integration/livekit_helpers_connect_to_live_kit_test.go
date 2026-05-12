/*
 * SPDX-License-Identifier: AGPL-3.0-or-later
 * Copyright (C) 2020-2026 Fluxer Contributors
 * Copyright (C) 2026 Floodilka Contributors
 * Modified by Floodilka Contributors starting March 2026. See LICENSE and NOTICE.
 */

package integration

import (
	lksdk "github.com/livekit/server-sdk-go/v2"
	"github.com/pion/webrtc/v4"
	"testing"
)

// connectToLiveKit connects to a LiveKit room using the provided server update information
func connectToLiveKit(t testing.TB, endpoint, token, roomName, identity string) *livekitConnection {
	t.Helper()

	hostURL := endpoint

	roomCB := &lksdk.RoomCallback{
		ParticipantCallback: lksdk.ParticipantCallback{
			OnTrackSubscribed: func(track *webrtc.TrackRemote, pub *lksdk.RemoteTrackPublication, rp *lksdk.RemoteParticipant) {
				t.Logf("Track subscribed: participant=%s track=%s", rp.Identity(), pub.SID())
			},
			OnTrackUnsubscribed: func(track *webrtc.TrackRemote, pub *lksdk.RemoteTrackPublication, rp *lksdk.RemoteParticipant) {
				t.Logf("Track unsubscribed: participant=%s track=%s", rp.Identity(), pub.SID())
			},
		},
		OnParticipantConnected: func(rp *lksdk.RemoteParticipant) {
			t.Logf("Participant connected: %s", rp.Identity())
		},
		OnDisconnected: func() {
			t.Logf("LiveKit room disconnected")
		},
		OnReconnecting: func() {
			t.Logf("LiveKit room reconnecting")
		},
		OnReconnected: func() {
			t.Logf("LiveKit room reconnected")
		},
	}

	room, err := lksdk.ConnectToRoomWithToken(hostURL, token, roomCB)
	if err != nil {
		t.Fatalf("failed to connect to LiveKit room: %v", err)
	}

	t.Logf("Connected to LiveKit room: %s as %s", roomName, identity)

	return &livekitConnection{
		room: room,
		t:    t,
	}
}
