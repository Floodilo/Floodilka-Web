/*
 * SPDX-License-Identifier: AGPL-3.0-or-later
 * Copyright (C) 2020-2026 Fluxer Contributors
 * Copyright (C) 2026 Floodilka Contributors
 * Modified by Floodilka Contributors starting March 2026. See LICENSE and NOTICE.
 */

package integration

import (
	"testing"
)

func TestGroupDMWithGatewayEvents(t *testing.T) {
	client := newTestClient(t)
	user1 := createTestAccount(t, client)
	user2 := createTestAccount(t, client)
	user3 := createTestAccount(t, client)

	user1Socket := newGatewayClient(t, client, user1.Token)
	t.Cleanup(user1Socket.Close)
	user2Socket := newGatewayClient(t, client, user2.Token)
	t.Cleanup(user2Socket.Close)
	user3Socket := newGatewayClient(t, client, user3.Token)
	t.Cleanup(user3Socket.Close)

	createFriendship(t, client, user1, user2)
	createFriendship(t, client, user1, user3)

	drainRelationshipEvents(t, user1Socket)
	drainRelationshipEvents(t, user2Socket)
	drainRelationshipEvents(t, user3Socket)

	dmChannel := createDmChannel(t, client, user1.Token, parseSnowflake(t, user2.UserID))
	waitForChannelEvent(t, user1Socket, "CHANNEL_CREATE", dmChannel.ID)

	message := sendChannelMessage(t, client, user1.Token, parseSnowflake(t, dmChannel.ID), "Before group conversion")
	waitForChannelEvent(t, user2Socket, "CHANNEL_CREATE", dmChannel.ID)
	waitForMessageEvent(t, user1Socket, "MESSAGE_CREATE", message.ID, nil)
	waitForMessageEvent(t, user2Socket, "MESSAGE_CREATE", message.ID, nil)

	groupDmChannel := createGroupDmChannel(t, client, user1.Token, user2.UserID, user3.UserID)
	waitForChannelEvent(t, user1Socket, "CHANNEL_CREATE", groupDmChannel.ID)
	waitForChannelEvent(t, user2Socket, "CHANNEL_CREATE", groupDmChannel.ID)
	waitForChannelEvent(t, user3Socket, "CHANNEL_CREATE", groupDmChannel.ID)

	groupMessage := sendChannelMessage(t, client, user3.Token, parseSnowflake(t, groupDmChannel.ID), "Hello from the new member!")
	waitForMessageEvent(t, user1Socket, "MESSAGE_CREATE", groupMessage.ID, nil)
	waitForMessageEvent(t, user2Socket, "MESSAGE_CREATE", groupMessage.ID, nil)
	waitForMessageEvent(t, user3Socket, "MESSAGE_CREATE", groupMessage.ID, nil)
}
