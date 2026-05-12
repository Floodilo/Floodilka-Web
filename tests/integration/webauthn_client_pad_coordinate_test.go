/*
 * SPDX-License-Identifier: AGPL-3.0-or-later
 * Copyright (C) 2020-2026 Fluxer Contributors
 * Copyright (C) 2026 Floodilka Contributors
 * Modified by Floodilka Contributors starting March 2026. See LICENSE and NOTICE.
 */

package integration

func padCoordinate(val []byte) []byte {
	if len(val) >= 32 {
		return val
	}
	padded := make([]byte, 32)
	copy(padded[32-len(val):], val)
	return padded
}
