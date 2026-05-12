/*
 * SPDX-License-Identifier: AGPL-3.0-or-later
 * Copyright (C) 2020-2026 Fluxer Contributors
 * Copyright (C) 2026 Floodilka Contributors
 * Modified by Floodilka Contributors starting March 2026. See LICENSE and NOTICE.
 */

package integration

import (
	"bytes"
	"crypto/ecdsa"
	"crypto/rand"
	"crypto/sha256"
	"encoding/binary"
	"testing"
)

// buildAuthenticationWithoutUV constructs an authentication response where the UV flag is not set.
func buildAuthenticationWithoutUV(t testing.TB, device *webAuthnDevice, options webAuthnAuthenticationOptions) map[string]any {
	t.Helper()

	challenge := decodeBase64URL(t, options.Challenge)
	clientData := map[string]any{
		"type":        "webauthn.get",
		"challenge":   encodeBase64URL(challenge),
		"origin":      device.origin,
		"crossOrigin": false,
	}
	clientDataJSON := mustJSON(t, clientData)

	rpHash := sha256.Sum256([]byte(device.rpID))
	flags := byte(0x01)

	buf := &bytes.Buffer{}
	buf.Write(rpHash[:])
	buf.WriteByte(flags)

	device.signCount++
	if err := binary.Write(buf, binary.BigEndian, device.signCount); err != nil {
		t.Fatalf("failed to write sign count: %v", err)
	}

	authData := buf.Bytes()
	clientDataHash := sha256.Sum256(clientDataJSON)
	sigInput := append(authData, clientDataHash[:]...)
	digest := sha256.Sum256(sigInput)

	signature, err := ecdsa.SignASN1(rand.Reader, device.privateKey, digest[:])
	if err != nil {
		t.Fatalf("failed to sign assertion: %v", err)
	}

	return map[string]any{
		"id":                     encodeBase64URL(device.credentialID),
		"rawId":                  encodeBase64URL(device.credentialID),
		"type":                   "public-key",
		"clientExtensionResults": map[string]any{},
		"response": map[string]any{
			"clientDataJSON":    encodeBase64URL(clientDataJSON),
			"authenticatorData": encodeBase64URL(authData),
			"signature":         encodeBase64URL(signature),
			"userHandle":        encodeBase64URL(device.userHandle),
		},
	}
}
