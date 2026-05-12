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

// totpCodeNext generates a TOTP code for the next 30-second time window.
// Useful when you need a different valid code than the current one
// (e.g., to avoid replay protection when making multiple MFA requests).
func totpCodeNext(t testing.TB, secret string) string {
	t.Helper()
	return totpCodeAt(t, secret, time.Now().Add(30*time.Second))
}
