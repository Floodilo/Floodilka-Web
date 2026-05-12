/*
 * SPDX-License-Identifier: AGPL-3.0-or-later
 * Copyright (C) 2020-2026 Fluxer Contributors
 * Copyright (C) 2026 Floodilka Contributors
 * Modified by Floodilka Contributors starting March 2026. See LICENSE and NOTICE.
 */

package integration

import (
	"crypto/ecdsa"
	"github.com/go-webauthn/webauthn/protocol/webauthncbor"
	"testing"
)

func marshalCOSEKey(t testing.TB, pub *ecdsa.PublicKey) []byte {
	t.Helper()
	xBytes := padCoordinate(pub.X.Bytes())
	yBytes := padCoordinate(pub.Y.Bytes())
	key := map[int]any{
		1:  2,
		3:  -7,
		-1: 1,
		-2: xBytes,
		-3: yBytes,
	}
	data, err := webauthncbor.Marshal(key)
	if err != nil {
		t.Fatalf("failed to marshal cose key: %v", err)
	}
	return data
}
