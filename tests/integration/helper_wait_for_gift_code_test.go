/*
 * SPDX-License-Identifier: AGPL-3.0-or-later
 * Copyright (C) 2020-2026 Fluxer Contributors
 * Copyright (C) 2026 Floodilka Contributors
 * Modified by Floodilka Contributors starting March 2026. See LICENSE and NOTICE.
 */

package integration

import (
	"testing"
	"time"
)

// WaitForGiftCode polls until a gift code matches the predicate.
func WaitForGiftCode(
	t testing.TB,
	client *testClient,
	token string,
	timeout time.Duration,
	predicate func(g GiftCodeMetadataResponse) bool,
) GiftCodeMetadataResponse {
	t.Helper()
	var matched GiftCodeMetadataResponse
	waitForCondition(t, timeout, func() (bool, error) {
		gifts := ListUserGifts(t, client, token)
		for _, gift := range gifts {
			if predicate(gift) {
				matched = gift
				return true, nil
			}
		}
		return false, nil
	})
	return matched
}
