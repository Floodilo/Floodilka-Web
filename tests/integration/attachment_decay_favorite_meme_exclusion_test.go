/*
 * SPDX-License-Identifier: AGPL-3.0-or-later
 * Copyright (C) 2020-2026 Fluxer Contributors
 * Copyright (C) 2026 Floodilka Contributors
 * Modified by Floodilka Contributors starting March 2026. See LICENSE and NOTICE.
 */

package integration

import (
	"fmt"
	"net/http"
	"testing"
)

func TestFavoriteMemeAttachmentsNeverHitDecay(t *testing.T) {
	client := newTestClient(t)
	user := createTestAccount(t, client)
	ensureSessionStarted(t, client, user.Token)

	channelID := parseSnowflake(t, user.UserID)

	resp, err := client.postJSONWithAuth(
		"/users/@me/memes",
		map[string]string{"url": favoriteMemeTestImageURL},
		user.Token,
	)
	if err != nil {
		t.Fatalf("failed to create favorite meme: %v", err)
	}
	assertStatus(t, resp, http.StatusCreated)

	var meme favoriteMemeResponse
	decodeJSONResponse(t, resp, &meme)

	resp, err = client.postJSONWithAuth(
		fmt.Sprintf("/channels/%d/messages", channelID),
		map[string]any{"favorite_meme_id": meme.ID},
		user.Token,
	)
	if err != nil {
		t.Fatalf("failed to send favorite meme message: %v", err)
	}
	assertStatus(t, resp, http.StatusOK)

	var created struct {
		ID          string `json:"id"`
		Attachments []struct {
			ID string `json:"id"`
		} `json:"attachments"`
	}
	decodeJSONResponse(t, resp, &created)

	if len(created.Attachments) == 0 {
		t.Fatalf("expected favorite meme message to include attachments")
	}

	attachmentID := created.Attachments[0].ID

	assertAttachmentDecayRowMissing(t, client, attachmentID, user.Token)

	resp, err = client.getWithAuth(fmt.Sprintf("/channels/%d/messages/%s", channelID, created.ID), user.Token)
	if err != nil {
		t.Fatalf("failed to fetch favorite meme message: %v", err)
	}
	assertStatus(t, resp, http.StatusOK)

	assertAttachmentDecayRowMissing(t, client, attachmentID, user.Token)
}

func assertAttachmentDecayRowMissing(t testing.TB, client *testClient, attachmentID, token string) {
	t.Helper()

	resp, err := client.getWithAuth(fmt.Sprintf("/test/attachment-decay/%s", attachmentID), token)
	if err != nil {
		t.Fatalf("failed to query attachment decay row: %v", err)
	}
	assertStatus(t, resp, http.StatusOK)

	var payload struct {
		Row *struct {
			AttachmentID string `json:"attachment_id"`
		} `json:"row"`
	}
	decodeJSONResponse(t, resp, &payload)
	if payload.Row != nil {
		t.Fatalf("expected no attachment decay entry for %s", attachmentID)
	}
}
