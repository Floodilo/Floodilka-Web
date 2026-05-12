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

func TestMessageUpdateFlags(t *testing.T) {
	client := newTestClient(t)
	owner := createTestAccount(t, client)
	ensureSessionStarted(t, client, owner.Token)

	guild := createGuild(t, client, owner.Token, "Message Flags Test Guild")
	channelID := parseSnowflake(t, guild.SystemChannel)

	messagePayload := map[string]string{"content": "Original message"}
	resp, err := client.postJSONWithAuth(fmt.Sprintf("/channels/%d/messages", channelID), messagePayload, owner.Token)
	if err != nil {
		t.Fatalf("failed to send message: %v", err)
	}
	assertStatus(t, resp, http.StatusOK)
	var message struct {
		ID    string `json:"id"`
		Flags int    `json:"flags"`
	}
	decodeJSONResponse(t, resp, &message)
	messageID := parseSnowflake(t, message.ID)

	t.Run("can update message with only flags", func(t *testing.T) {
		payload := map[string]int{"flags": 4}
		resp, err := client.patchJSONWithAuth(fmt.Sprintf("/channels/%d/messages/%d", channelID, messageID), payload, owner.Token)
		if err != nil {
			t.Fatalf("failed to update message flags: %v", err)
		}
		assertStatus(t, resp, http.StatusOK)

		var updatedMessage struct {
			ID    string `json:"id"`
			Flags int    `json:"flags"`
		}
		decodeJSONResponse(t, resp, &updatedMessage)

		if updatedMessage.Flags != 4 {
			t.Errorf("expected flags to be 4, got %d", updatedMessage.Flags)
		}
	})

	t.Run("can update message with flags and content", func(t *testing.T) {
		payload := map[string]any{
			"content": "Updated content",
			"flags":   0,
		}
		resp, err := client.patchJSONWithAuth(fmt.Sprintf("/channels/%d/messages/%d", channelID, messageID), payload, owner.Token)
		if err != nil {
			t.Fatalf("failed to update message: %v", err)
		}
		assertStatus(t, resp, http.StatusOK)

		var updatedMessage struct {
			ID      string `json:"id"`
			Content string `json:"content"`
			Flags   int    `json:"flags"`
		}
		decodeJSONResponse(t, resp, &updatedMessage)

		if updatedMessage.Content != "Updated content" {
			t.Errorf("expected content 'Updated content', got '%s'", updatedMessage.Content)
		}
		if updatedMessage.Flags != 0 {
			t.Errorf("expected flags to be 0, got %d", updatedMessage.Flags)
		}
	})

	t.Run("reject update with empty content and no flags", func(t *testing.T) {
		payload := map[string]string{"content": ""}
		resp, err := client.patchJSONWithAuth(fmt.Sprintf("/channels/%d/messages/%d", channelID, messageID), payload, owner.Token)
		if err != nil {
			t.Fatalf("failed to make request: %v", err)
		}
		assertStatus(t, resp, http.StatusBadRequest)
		resp.Body.Close()
	})

	t.Run("can update message with flags even if content is not provided", func(t *testing.T) {
		payload := map[string]int{"flags": 4}
		resp, err := client.patchJSONWithAuth(fmt.Sprintf("/channels/%d/messages/%d", channelID, messageID), payload, owner.Token)
		if err != nil {
			t.Fatalf("failed to update message flags: %v", err)
		}
		assertStatus(t, resp, http.StatusOK)

		var updatedMessage struct {
			ID    string `json:"id"`
			Flags int    `json:"flags"`
		}
		decodeJSONResponse(t, resp, &updatedMessage)

		if updatedMessage.Flags != 4 {
			t.Errorf("expected flags to be 4, got %d", updatedMessage.Flags)
		}
	})

	t.Run("moderator can update flags on other user's message in guild", func(t *testing.T) {
		member := createTestAccount(t, client)
		ensureSessionStarted(t, client, member.Token)

		invite := createChannelInvite(t, client, owner.Token, channelID)
		joinGuild(t, client, member.Token, invite.Code)

		memberMsgPayload := map[string]string{"content": "Member message"}
		resp, err := client.postJSONWithAuth(fmt.Sprintf("/channels/%d/messages", channelID), memberMsgPayload, member.Token)
		if err != nil {
			t.Fatalf("failed to send message: %v", err)
		}
		assertStatus(t, resp, http.StatusOK)
		var memberMsg struct {
			ID string `json:"id"`
		}
		decodeJSONResponse(t, resp, &memberMsg)
		memberMsgID := parseSnowflake(t, memberMsg.ID)

		payload := map[string]int{"flags": 4}
		resp, err = client.patchJSONWithAuth(fmt.Sprintf("/channels/%d/messages/%d", channelID, memberMsgID), payload, owner.Token)
		if err != nil {
			t.Fatalf("failed to update message flags: %v", err)
		}
		assertStatus(t, resp, http.StatusOK)

		var updatedMessage struct {
			ID    string `json:"id"`
			Flags int    `json:"flags"`
		}
		decodeJSONResponse(t, resp, &updatedMessage)

		if updatedMessage.Flags != 4 {
			t.Errorf("expected flags to be 4, got %d", updatedMessage.Flags)
		}
	})

	t.Run("regular user cannot update flags on other user's message in guild", func(t *testing.T) {
		member2 := createTestAccount(t, client)
		ensureSessionStarted(t, client, member2.Token)

		invite := createChannelInvite(t, client, owner.Token, channelID)
		joinGuild(t, client, member2.Token, invite.Code)

		payload := map[string]int{"flags": 4}
		resp, err := client.patchJSONWithAuth(fmt.Sprintf("/channels/%d/messages/%d", channelID, messageID), payload, member2.Token)
		if err != nil {
			t.Fatalf("failed to make request: %v", err)
		}
		assertStatus(t, resp, http.StatusForbidden)
		resp.Body.Close()
	})

	t.Run("only author can update flags in DM", func(t *testing.T) {
		user1 := createTestAccount(t, client)
		user2 := createTestAccount(t, client)
		ensureSessionStarted(t, client, user1.Token)
		ensureSessionStarted(t, client, user2.Token)

		createFriendship(t, client, user1, user2)

		dmChannel := createDmChannel(t, client, user1.Token, parseSnowflake(t, user2.UserID))
		dmChannelID := parseSnowflake(t, dmChannel.ID)

		msg := sendChannelMessage(t, client, user1.Token, dmChannelID, "DM Message")
		msgID := parseSnowflake(t, msg.ID)

		payload := map[string]int{"flags": 4}
		resp, err := client.patchJSONWithAuth(fmt.Sprintf("/channels/%d/messages/%d", dmChannelID, msgID), payload, user2.Token)
		if err != nil {
			t.Fatalf("failed to make request: %v", err)
		}
		assertStatus(t, resp, http.StatusForbidden)
		resp.Body.Close()

		resp, err = client.patchJSONWithAuth(fmt.Sprintf("/channels/%d/messages/%d", dmChannelID, msgID), payload, user1.Token)
		if err != nil {
			t.Fatalf("failed to update message flags: %v", err)
		}
		assertStatus(t, resp, http.StatusOK)

		var updatedMessage struct {
			ID    string `json:"id"`
			Flags int    `json:"flags"`
		}
		decodeJSONResponse(t, resp, &updatedMessage)

		if updatedMessage.Flags != 4 {
			t.Errorf("expected flags to be 4, got %d", updatedMessage.Flags)
		}
	})

	t.Run("only author can update flags in Group DM", func(t *testing.T) {
		user1 := createTestAccount(t, client)
		user2 := createTestAccount(t, client)
		user3 := createTestAccount(t, client)
		ensureSessionStarted(t, client, user1.Token)
		ensureSessionStarted(t, client, user2.Token)
		ensureSessionStarted(t, client, user3.Token)

		guild := createGuild(t, client, user1.Token, "Test Guild")
		invite := createChannelInvite(t, client, user1.Token, parseSnowflake(t, guild.SystemChannel))
		joinGuild(t, client, user2.Token, invite.Code)
		joinGuild(t, client, user3.Token, invite.Code)

		createFriendship(t, client, user1, user2)
		createFriendship(t, client, user1, user3)

		groupChannel := createGroupDmChannel(t, client, user1.Token, user2.UserID, user3.UserID)
		groupChannelID := parseSnowflake(t, groupChannel.ID)

		msg := sendChannelMessage(t, client, user1.Token, groupChannelID, "Group DM Message")
		msgID := parseSnowflake(t, msg.ID)

		payload := map[string]int{"flags": 4}
		resp, err = client.patchJSONWithAuth(fmt.Sprintf("/channels/%d/messages/%d", groupChannelID, msgID), payload, user2.Token)
		if err != nil {
			t.Fatalf("failed to make request: %v", err)
		}
		assertStatus(t, resp, http.StatusForbidden)
		resp.Body.Close()

		resp, err = client.patchJSONWithAuth(fmt.Sprintf("/channels/%d/messages/%d", groupChannelID, msgID), payload, user1.Token)
		if err != nil {
			t.Fatalf("failed to update message flags: %v", err)
		}
		assertStatus(t, resp, http.StatusOK)

		var updatedMessage struct {
			ID    string `json:"id"`
			Flags int    `json:"flags"`
		}
		decodeJSONResponse(t, resp, &updatedMessage)

		if updatedMessage.Flags != 4 {
			t.Errorf("expected flags to be 4, got %d", updatedMessage.Flags)
		}
	})
}
