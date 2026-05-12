/*
 * SPDX-License-Identifier: AGPL-3.0-or-later
 * Copyright (C) 2020-2026 Fluxer Contributors
 * Copyright (C) 2026 Floodilka Contributors
 * Modified by Floodilka Contributors starting March 2026. See LICENSE and NOTICE.
 */

package integration

import "encoding/base64"

// getLargeBase64 generates a base64 payload whose decoded size is >= sizeBytes.
func getLargeBase64(sizeBytes int) string {
	if sizeBytes < len(validPNGBytes) {
		sizeBytes = len(validPNGBytes)
	}

	data := make([]byte, sizeBytes)
	copy(data, validPNGBytes)
	for i := len(validPNGBytes); i < len(data); i++ {
		data[i] = 0xFF
	}

	return base64.StdEncoding.EncodeToString(data)
}
