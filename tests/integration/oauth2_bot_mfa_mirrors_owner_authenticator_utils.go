/*
 * SPDX-License-Identifier: AGPL-3.0-or-later
 * Copyright (C) 2020-2026 Fluxer Contributors
 * Copyright (C) 2026 Floodilka Contributors
 * Modified by Floodilka Contributors starting March 2026. See LICENSE and NOTICE.
 */

package integration

func containsAuthenticatorType(types []int, expected int) bool {
	for _, v := range types {
		if v == expected {
			return true
		}
	}
	return false
}
