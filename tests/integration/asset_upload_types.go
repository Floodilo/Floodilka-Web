/*
 * SPDX-License-Identifier: AGPL-3.0-or-later
 * Copyright (C) 2020-2026 Fluxer Contributors
 * Copyright (C) 2026 Floodilka Contributors
 * Modified by Floodilka Contributors starting March 2026. See LICENSE and NOTICE.
 */

package integration

// assetVerifyResponse is the response from /test/verify-asset/* endpoints
type assetVerifyResponse struct {
	Hash       *string `json:"hash"`
	S3Key      string  `json:"s3_key,omitempty"`
	ExistsInS3 *bool   `json:"existsInS3"`
	Message    string  `json:"message,omitempty"`
	Error      string  `json:"error,omitempty"`
}
