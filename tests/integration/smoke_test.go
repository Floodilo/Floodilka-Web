/*
 * SPDX-License-Identifier: AGPL-3.0-or-later
 * Copyright (C) 2020-2026 Fluxer Contributors
 * Copyright (C) 2026 Floodilka Contributors
 * Modified by Floodilka Contributors starting March 2026. See LICENSE and NOTICE.
 */

package integration

import (
	"io"
	"net/http"
	"strings"
	"testing"
	"time"
)

func TestHealthEndpoint(t *testing.T) {
	client := newTestClient(t)

	timeout := time.After(2 * time.Minute)
	ticker := time.NewTicker(2 * time.Second)
	defer ticker.Stop()

	for {
		select {
		case <-timeout:
			t.Fatalf("API did not report healthy within the expected time")
		case <-ticker.C:
			resp, err := client.get("/_health")
			if err != nil {
				continue
			}
			body, readErr := io.ReadAll(resp.Body)
			resp.Body.Close()
			if readErr != nil {
				continue
			}
			if resp.StatusCode == http.StatusOK && strings.TrimSpace(string(body)) == "OK" {
				return
			}
		}
	}
}
