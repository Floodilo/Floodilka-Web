/*
 * SPDX-License-Identifier: AGPL-3.0-or-later
 * Copyright (C) 2020-2026 Fluxer Contributors
 * Copyright (C) 2026 Floodilka Contributors
 * Modified by Floodilka Contributors starting March 2026. See LICENSE and NOTICE.
 */

package integration

import (
	"fmt"
	"net/http"
	"testing"
	"time"
)

// TestClientSecretReset verifies client secret rotation requires sudo and returns a new secret.
func TestClientSecretReset(t *testing.T) {
	client := newTestClient(t)
	owner := createTestAccount(t, client)

	appID, _, _, clientSecret := createOAuth2Application(
		t, client, owner,
		fmt.Sprintf("Client Secret Reset %d", time.Now().UnixNano()),
		[]string{"https://example.com/callback"},
		[]string{"identify"},
	)

	if clientSecret == "" {
		t.Fatal("creation should return client secret")
	}

	newSecret := resetClientSecret(t, client, owner, appID)
	if newSecret == clientSecret {
		t.Fatalf("reset should issue new secret")
	}

	code, _ := obtainAuthCode(t, client, appID, "https://example.com/callback", []string{"identify"})
	form := buildTokenForm(code, "https://example.com/callback")
	req := newFormRequest(t, client, "/oauth2/token", form)
	req.SetBasicAuth(appID, clientSecret)

	resp, err := client.httpClient.Do(req)
	if err != nil {
		t.Fatalf("token request failed: %v", err)
	}
	resp.Body.Close()
	if resp.StatusCode == http.StatusOK {
		t.Fatalf("old client secret should not work after rotation")
	}

	req2 := newFormRequest(t, client, "/oauth2/token", form)
	req2.SetBasicAuth(appID, newSecret)
	resp2, err := client.httpClient.Do(req2)
	if err != nil {
		t.Fatalf("token request failed: %v", err)
	}
	defer resp2.Body.Close()
	if resp2.StatusCode != http.StatusOK {
		t.Fatalf("new secret should work, got %d: %s", resp2.StatusCode, readResponseBody(resp2))
	}
}
