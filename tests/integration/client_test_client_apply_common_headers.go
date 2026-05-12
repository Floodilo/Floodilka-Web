/*
 * SPDX-License-Identifier: AGPL-3.0-or-later
 * Copyright (C) 2020-2026 Fluxer Contributors
 * Copyright (C) 2026 Floodilka Contributors
 * Modified by Floodilka Contributors starting March 2026. See LICENSE and NOTICE.
 */

package integration

import (
	"net/http"
)

func (c *testClient) applyCommonHeaders(req *http.Request) {
	req.Header.Set("Accept", "application/json")
	if c.clientIP != "" {
		req.Header.Set("X-Forwarded-For", c.clientIP)
	}
	c.applyTestToken(req)
}
