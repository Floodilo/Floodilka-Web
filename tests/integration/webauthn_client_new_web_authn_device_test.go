/*
 * SPDX-License-Identifier: AGPL-3.0-or-later
 * Copyright (C) 2020-2026 Fluxer Contributors
 * Copyright (C) 2026 Floodilka Contributors
 * Modified by Floodilka Contributors starting March 2026. See LICENSE and NOTICE.
 */

package integration

import (
	"crypto/ecdsa"
	"crypto/elliptic"
	"crypto/rand"
	"testing"
)

func newWebAuthnDevice(t testing.TB) *webAuthnDevice {
	t.Helper()

	priv, err := ecdsa.GenerateKey(elliptic.P256(), rand.Reader)
	if err != nil {
		t.Fatalf("failed to generate webauthn key: %v", err)
	}
	rpID, origin := resolveWebAuthnOrigin()
	return &webAuthnDevice{
		privateKey: priv,
		rpID:       rpID,
		origin:     origin,
		signCount:  0,
	}
}
