/*
 * SPDX-License-Identifier: AGPL-3.0-or-later
 * Copyright (C) 2020-2026 Fluxer Contributors
 * Copyright (C) 2026 Floodilka Contributors
 * Modified by Floodilka Contributors starting March 2026. See LICENSE and NOTICE.
 */

package integration

import (
	"bytes"
	"crypto/sha256"
	"encoding/binary"
	"fmt"
)

func (d *webAuthnDevice) buildAssertionAuthData() []byte {
	rpHash := sha256.Sum256([]byte(d.rpID))
	flags := byte(0x01 | 0x04)
	buf := &bytes.Buffer{}
	buf.Write(rpHash[:])
	buf.WriteByte(flags)

	d.signCount++
	if err := binary.Write(buf, binary.BigEndian, d.signCount); err != nil {
		panic(fmt.Sprintf("failed to write sign count: %v", err))
	}

	return buf.Bytes()
}
