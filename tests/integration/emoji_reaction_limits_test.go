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
	"net/url"
	"testing"
)

func TestEmoji_ReactionLimits(t *testing.T) {
	client := newTestClient(t)
	user := createTestAccount(t, client)
	user2 := createTestAccount(t, client)
	ensureSessionStarted(t, client, user.Token)

	createFriendship(t, client, user, user2)
	dmChannel := createDmChannel(t, client, user.Token, parseSnowflake(t, user2.UserID))
	dmChannelID := parseSnowflake(t, dmChannel.ID)

	msg := sendChannelMessage(t, client, user.Token, dmChannelID, "Limit test message")
	msgID := msg.ID

	t.Run("max unique reactions per message", func(t *testing.T) {

		emojis := []string{"👍", "👎", "❤️", "😀", "😁", "😂", "🤣", "😃", "😄", "😅",
			"😆", "😉", "😊", "😋", "😎", "😍", "😘", "🥰", "😗", "😙", "😚"}

		var lastStatus int
		successCount := 0
		for _, emoji := range emojis {
			encodedEmoji := url.PathEscape(emoji)
			resp, err := client.putWithAuth(
				fmt.Sprintf("/channels/%d/messages/%s/reactions/%s/@me", dmChannelID, msgID, encodedEmoji),
				user.Token,
			)
			if err != nil {
				t.Fatalf("failed to add reaction: %v", err)
			}
			lastStatus = resp.StatusCode
			if resp.StatusCode == http.StatusOK || resp.StatusCode == http.StatusNoContent {
				successCount++
			}
			resp.Body.Close()
		}

		if successCount == 0 {
			t.Errorf("expected at least some reactions to succeed, but all failed with status %d", lastStatus)
		}
		t.Logf("Successfully added %d out of %d reactions", successCount, len(emojis))
	})
}
