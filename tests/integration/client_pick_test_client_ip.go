/*
 * SPDX-License-Identifier: AGPL-3.0-or-later
 * Copyright (C) 2020-2026 Fluxer Contributors
 * Copyright (C) 2026 Floodilka Contributors
 * Modified by Floodilka Contributors starting March 2026. See LICENSE and NOTICE.
 */

package integration

import (
	"crypto/rand"
	"fmt"
	"os"
	"time"
)

func pickTestClientIP() string {
	if ip := os.Getenv("FLOODILKA_TEST_IP"); ip != "" {
		return ip
	}

	buf := make([]byte, 1)
	if _, err := rand.Read(buf); err == nil {
		return fmt.Sprintf("198.51.100.%d", 10+int(buf[0])%200)
	}

	return fmt.Sprintf("198.51.100.%d", time.Now().UnixNano()%200+10)
}
