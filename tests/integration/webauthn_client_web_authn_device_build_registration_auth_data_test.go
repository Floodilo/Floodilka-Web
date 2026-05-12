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
	"crypto/sha256"
	"encoding/binary"
	"testing"
)

func (d *webAuthnDevice) buildRegistrationAuthData(t testing.TB) []byte {
	t.Helper()
	rpHash := sha256.Sum256([]byte(d.rpID))

	flags := byte(0x01 | 0x04 | 0x40)
	buf := &bytes.Buffer{}
	buf.Write(rpHash[:])
	buf.WriteByte(flags)

	if err := binary.Write(buf, binary.BigEndian, d.signCount); err != nil {
		t.Fatalf("failed to write sign count: %v", err)
	}

	aaguid := make([]byte, 16)
	buf.Write(aaguid)

	credID := d.credentialID
	if err := binary.Write(buf, binary.BigEndian, uint16(len(credID))); err != nil {
		t.Fatalf("failed to write credential id length: %v", err)
	}
	buf.Write(credID)

	pubKeyCBOR := marshalCOSEKey(t, d.privateKey.Public().(*ecdsa.PublicKey))
	buf.Write(pubKeyCBOR)

	return buf.Bytes()
}
