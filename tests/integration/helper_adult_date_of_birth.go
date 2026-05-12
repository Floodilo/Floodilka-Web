/*
 * SPDX-License-Identifier: AGPL-3.0-or-later
 * Copyright (C) 2020-2026 Fluxer Contributors
 * Copyright (C) 2026 Floodilka Contributors
 * Modified by Floodilka Contributors starting March 2026. See LICENSE and NOTICE.
 */

package integration

import (
	"time"
)

func adultDateOfBirth() string {
	return time.Now().AddDate(-20, 0, 0).Format("2006-01-02")
}

func minorDateOfBirth() string {
	return time.Now().AddDate(-17, 0, 0).Format("2006-01-02")
}
