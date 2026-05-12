/*
 * SPDX-License-Identifier: AGPL-3.0-or-later
 * Copyright (C) 2020-2026 Fluxer Contributors
 * Copyright (C) 2026 Floodilka Contributors
 * Modified by Floodilka Contributors starting March 2026. See LICENSE and NOTICE.
 */

package integration

import (
	"encoding/json"
	"fmt"
	"strings"
	"testing"
	"time"
)

func drainRelationshipEvents(t testing.TB, gw interface {
	NextDispatch(timeout time.Duration) (string, json.RawMessage)
}) {
	t.Helper()
	timeout := 100 * time.Millisecond
	defer func() {
		if r := recover(); r != nil {
			if !strings.Contains(fmt.Sprint(r), "context deadline exceeded") {
				panic(r)
			}
		}
	}()
	for {
		eventName, _ := gw.NextDispatch(timeout)
		if eventName == "" {
			return
		}
		if eventName == "READY" || eventName == "RESUMED" {
			continue
		}
		if eventName != "RELATIONSHIP_ADD" && eventName != "RELATIONSHIP_UPDATE" && eventName != "PRESENCE_UPDATE" {
			t.Fatalf("expected RELATIONSHIP or PRESENCE_UPDATE event while draining, got %s", eventName)
		}
	}
}
