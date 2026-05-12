/*
 * SPDX-License-Identifier: AGPL-3.0-or-later
 * Copyright (C) 2020-2026 Fluxer Contributors
 * Copyright (C) 2026 Floodilka Contributors
 * Modified by Floodilka Contributors starting March 2026. See LICENSE and NOTICE.
 */

package integration

import (
	"github.com/go-webauthn/webauthn/protocol/webauthncbor"
	"testing"
)

func buildAttestationObject(t testing.TB, authData []byte) []byte {
	t.Helper()
	payload := map[string]any{
		"fmt":      "none",
		"attStmt":  map[string]any{},
		"authData": authData,
	}
	data, err := webauthncbor.Marshal(payload)
	if err != nil {
		t.Fatalf("failed to marshal attestation object: %v", err)
	}
	return data
}
