/*
 * SPDX-License-Identifier: AGPL-3.0-or-later
 * Copyright (C) 2020-2026 Fluxer Contributors
 * Copyright (C) 2026 Floodilka Contributors
 * Modified by Floodilka Contributors starting March 2026. See LICENSE and NOTICE.
 */

package integration

import (
	"testing"
)

func (a *testAccount) login(t testing.TB, client *testClient) {
	t.Helper()
	loginResp := loginTestUser(t, client, a.Email, a.Password)
	if loginResp.Token != "" {
		a.Token = loginResp.Token
	}
}
