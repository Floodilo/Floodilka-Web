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

func TestFavoriteMemeSendsAttachmentInPersonalNotes(t *testing.T) {
	client := newTestClient(t)
	user := createTestAccount(t, client)

	ensureSessionStarted(t, client, user.Token)

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

	channelID := parseSnowflake(t, user.UserID)

	resp, err = client.postJSONWithAuth(
		fmt.Sprintf("/channels/%d/messages", channelID),
		map[string]any{"favorite_meme_id": meme.ID},
		user.Token,
	)
	if err != nil {
		t.Fatalf("failed to send favorite meme message: %v", err)
	}
	assertStatus(t, resp, http.StatusOK)

	var created messageResponse
	decodeJSONResponse(t, resp, &created)

	messageID := parseSnowflake(t, created.ID)
	resp, err = client.getWithAuth(fmt.Sprintf("/channels/%d/messages/%d", channelID, messageID), user.Token)
	if err != nil {
		t.Fatalf("failed to fetch personal note message: %v", err)
	}
	assertStatus(t, resp, http.StatusOK)

	var fetched struct {
		ID          string `json:"id"`
		Content     string `json:"content"`
		Attachments []struct {
			ID       string `json:"id"`
			Filename string `json:"filename"`
		} `json:"attachments"`
	}
	decodeJSONResponse(t, resp, &fetched)

	if fetched.ID != created.ID {
		t.Fatalf("expected message ID %s, got %s", created.ID, fetched.ID)
	}
	if len(fetched.Attachments) != 1 {
		t.Fatalf("expected one attachment, got %d", len(fetched.Attachments))
	}
	if fetched.Attachments[0].Filename != meme.Filename {
		t.Fatalf("expected attachment filename %q, got %q", meme.Filename, fetched.Attachments[0].Filename)
	}
}
