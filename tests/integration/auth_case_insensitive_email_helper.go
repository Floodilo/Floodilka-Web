/*
 * SPDX-License-Identifier: AGPL-3.0-or-later
 * Copyright (C) 2020-2026 Fluxer Contributors
 * Copyright (C) 2026 Floodilka Contributors
 * Modified by Floodilka Contributors starting March 2026. See LICENSE and NOTICE.
 */

package integration

import (
	"strings"
)

func mixedCase(s string) string {
	result := []rune(s)
	for i, r := range result {
		if i%2 == 0 {
			result[i] = []rune(strings.ToUpper(string(r)))[0]
		} else {
			result[i] = []rune(strings.ToLower(string(r)))[0]
		}
	}
	return string(result)
}
