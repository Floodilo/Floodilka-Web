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

// loginWithTotp re-authenticates an MFA user using their TOTP secret.
func (a *testAccount) loginWithTotp(t testing.TB, client *testClient, totpSecret string) {
	t.Helper()
	loginResp := loginTestUserWithTotp(t, client, a.Email, a.Password, totpSecret)
	a.Token = loginResp.Token
}
