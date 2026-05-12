/*
 * SPDX-License-Identifier: AGPL-3.0-or-later
 * Copyright (C) 2020-2026 Fluxer Contributors
 * Copyright (C) 2026 Floodilka Contributors
 * Modified by Floodilka Contributors starting March 2026. See LICENSE and NOTICE.
 */

package integration

// userDataExistsResponse represents the response from /test/users/:userId/data-exists
type userDataExistsResponse struct {
	UserExists         bool    `json:"user_exists"`
	EmailCleared       bool    `json:"email_cleared"`
	PhoneCleared       bool    `json:"phone_cleared"`
	PasswordCleared    bool    `json:"password_cleared"`
	Flags              string  `json:"flags"`
	HasDeletedFlag     bool    `json:"has_deleted_flag"`
	HasSelfDeletedFlag bool    `json:"has_self_deleted_flag"`
	PendingDeletionAt  *string `json:"pending_deletion_at"`
	RelationshipsCount int     `json:"relationships_count"`
	SessionsCount      int     `json:"sessions_count"`
	OAuthTokensCount   int     `json:"oauth_tokens_count"`
	PinnedDmsCount     int     `json:"pinned_dms_count"`
	SavedMessagesCount int     `json:"saved_messages_count"`
}
