/*
 * SPDX-License-Identifier: AGPL-3.0-or-later
 * Copyright (C) 2020-2026 Fluxer Contributors
 * Copyright (C) 2026 Floodilka Contributors
 * Modified by Floodilka Contributors starting March 2026. See LICENSE and NOTICE.
 */

package integration

import (
	"crypto/rand"
	"encoding/base32"
	"testing"
)

func newTotpSecret(t testing.TB) string {
	t.Helper()
	buf := make([]byte, 20)
	if _, err := rand.Read(buf); err != nil {
		t.Fatalf("failed to generate totp secret: %v", err)
	}
	return base32.StdEncoding.WithPadding(base32.NoPadding).EncodeToString(buf)
}
