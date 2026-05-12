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

func TestKlipyCachingBehavior(t *testing.T) {
	client := newTestClient(t)
	user := createTestAccount(t, client)

	t.Run("featured GIFs endpoint is accessible", func(t *testing.T) {
		featuredResp1 := getKlipyFeatured(t, client, user.Token, "")
		featuredResp2 := getKlipyFeatured(t, client, user.Token, "")

		if featuredResp1 == nil || featuredResp2 == nil {
			t.Fatal("expected featured responses, got nil")
		}

		t.Logf("Both requests returned featured GIFs successfully")
	})

	t.Run("trending GIFs endpoint is accessible", func(t *testing.T) {
		trendingResp1 := getKlipyTrending(t, client, user.Token, "")
		trendingResp2 := getKlipyTrending(t, client, user.Token, "")

		if len(trendingResp1) == 0 || len(trendingResp2) == 0 {
			t.Fatal("expected trending responses to contain GIFs")
		}

		t.Logf("Both requests returned trending GIFs successfully (%d and %d GIFs)", len(trendingResp1), len(trendingResp2))
	})
}
