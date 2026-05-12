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

func (d *webAuthnDevice) registerResponse(t testing.TB, options webAuthnRegistrationOptions) map[string]any {
	t.Helper()

	challenge := decodeBase64URL(t, options.Challenge)
	d.userHandle = decodeBase64URL(t, options.User.ID)

	if d.credentialID == nil {
		d.credentialID = randomBytes(t, 32)
	}

	clientData := map[string]any{
		"type":        "webauthn.create",
		"challenge":   encodeBase64URL(challenge),
		"origin":      d.origin,
		"crossOrigin": false,
	}
	clientDataJSON := mustJSON(t, clientData)

	authData := d.buildRegistrationAuthData(t)
	attestationObject := buildAttestationObject(t, authData)

	return map[string]any{
		"id":                     encodeBase64URL(d.credentialID),
		"rawId":                  encodeBase64URL(d.credentialID),
		"type":                   "public-key",
		"clientExtensionResults": map[string]any{},
		"response": map[string]any{
			"clientDataJSON":    encodeBase64URL(clientDataJSON),
			"attestationObject": encodeBase64URL(attestationObject),
			"transports":        []string{"internal"},
		},
	}
}
