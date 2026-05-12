/*
 * SPDX-License-Identifier: AGPL-3.0-or-later
 * Copyright (C) 2020-2026 Fluxer Contributors
 * Copyright (C) 2026 Floodilka Contributors
 * Modified by Floodilka Contributors starting March 2026. See LICENSE and NOTICE.
 */

package integration

const favoriteMemeTestImageURL = "https://picsum.photos/100"

// favoriteMemeResponse represents the API response for a favorite meme.
type favoriteMemeResponse struct {
	ID           string   `json:"id"`
	UserID       string   `json:"user_id"`
	Name         string   `json:"name"`
	AltText      *string  `json:"alt_text"`
	Tags         []string `json:"tags"`
	AttachmentID string   `json:"attachment_id"`
	Filename     string   `json:"filename"`
	ContentType  string   `json:"content_type"`
	ContentHash  *string  `json:"content_hash"`
	Size         int64    `json:"size"`
	Width        *int     `json:"width"`
	Height       *int     `json:"height"`
	Duration     *float64 `json:"duration"`
	URL          string   `json:"url"`
	IsGifv       bool     `json:"is_gifv"`
	KlipyID      *string  `json:"klipy_id"`
	CreatedAt    string   `json:"created_at"`
}
