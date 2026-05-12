/*
 * SPDX-License-Identifier: AGPL-3.0-or-later
 * Copyright (C) 2020-2026 Fluxer Contributors
 * Copyright (C) 2026 Floodilka Contributors
 * Modified by Floodilka Contributors starting March 2026. See LICENSE and NOTICE.
 */

package integration

import (
	"crypto/ecdsa"
	"crypto/rand"
	"crypto/sha256"
	"testing"
)

func (d *webAuthnDevice) authenticationResponse(t testing.TB, options webAuthnAuthenticationOptions) map[string]any {
	t.Helper()

	challenge := decodeBase64URL(t, options.Challenge)
	clientData := map[string]any{
		"type":        "webauthn.get",
		"challenge":   encodeBase64URL(challenge),
		"origin":      d.origin,
		"crossOrigin": false,
	}
	clientDataJSON := mustJSON(t, clientData)

	authData := d.buildAssertionAuthData()
	clientDataHash := sha256.Sum256(clientDataJSON)
	sigInput := append(authData, clientDataHash[:]...)
	digest := sha256.Sum256(sigInput)

	signature, err := ecdsa.SignASN1(rand.Reader, d.privateKey, digest[:])
	if err != nil {
		t.Fatalf("failed to sign assertion: %v", err)
	}

	return map[string]any{
		"id":                     encodeBase64URL(d.credentialID),
		"rawId":                  encodeBase64URL(d.credentialID),
		"type":                   "public-key",
		"clientExtensionResults": map[string]any{},
		"response": map[string]any{
			"clientDataJSON":    encodeBase64URL(clientDataJSON),
			"authenticatorData": encodeBase64URL(authData),
			"signature":         encodeBase64URL(signature),
			"userHandle":        encodeBase64URL(d.userHandle),
		},
	}
}
