/*
 * SPDX-License-Identifier: AGPL-3.0-or-later
 * Copyright (C) 2020-2026 Fluxer Contributors
 * Copyright (C) 2026 Floodilka Contributors
 * Modified by Floodilka Contributors starting March 2026. See LICENSE and NOTICE.
 */

package integration

import (
	"crypto/hmac"
	"crypto/sha1"
	"encoding/base32"
	"encoding/binary"
	"fmt"
	"strings"
	"testing"
	"time"
)

func totpCodeAt(t testing.TB, secret string, at time.Time) string {
	t.Helper()
	decoder := base32.StdEncoding.WithPadding(base32.NoPadding)
	normalized := strings.ToUpper(strings.ReplaceAll(secret, " ", ""))
	key, err := decoder.DecodeString(normalized)
	if err != nil {
		t.Fatalf("failed to decode totp secret: %v", err)
	}

	counter := uint64(at.Unix() / 30)
	var counterBytes [8]byte
	binary.BigEndian.PutUint64(counterBytes[:], counter)

	mac := hmac.New(sha1.New, key)
	if _, err := mac.Write(counterBytes[:]); err != nil {
		t.Fatalf("failed to compute totp hmac: %v", err)
	}
	sum := mac.Sum(nil)
	offset := sum[len(sum)-1] & 0x0f
	code := ((int(sum[offset]) & 0x7f) << 24) |
		((int(sum[offset+1]) & 0xff) << 16) |
		((int(sum[offset+2]) & 0xff) << 8) |
		(int(sum[offset+3]) & 0xff)
	code %= 1000000
	return fmt.Sprintf("%06d", code)
}
