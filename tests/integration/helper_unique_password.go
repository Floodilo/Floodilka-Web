/*
 * SPDX-License-Identifier: AGPL-3.0-or-later
 * Copyright (C) 2020-2026 Fluxer Contributors
 * Copyright (C) 2026 Floodilka Contributors
 * Modified by Floodilka Contributors starting March 2026. See LICENSE and NOTICE.
 */

package integration

import (
	"fmt"
	"time"
)

func uniquePassword() string {
	return fmt.Sprintf("Sup3r-%d-%s!", time.Now().UnixNano(), "Pass")
}
