/*
 * SPDX-License-Identifier: AGPL-3.0-or-later
 * Copyright (C) 2020-2026 Fluxer Contributors
 * Copyright (C) 2026 Floodilka Contributors
 * Modified by Floodilka Contributors starting March 2026. See LICENSE and NOTICE.
 */

package integration

import (
	"encoding/base64"
	"testing"
)

func decodeBase64URL(t testing.TB, value string) []byte {
	t.Helper()
	decoders := []*base64.Encoding{base64.RawURLEncoding, base64.URLEncoding, base64.RawStdEncoding, base64.StdEncoding}
	for _, enc := range decoders {
		if b, err := enc.DecodeString(value); err == nil {
			return b
		}
	}
	t.Fatalf("failed to decode base64 value: %s", value)
	return nil
}
