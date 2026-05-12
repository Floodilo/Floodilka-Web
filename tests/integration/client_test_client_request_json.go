/*
 * SPDX-License-Identifier: AGPL-3.0-or-later
 * Copyright (C) 2020-2026 Fluxer Contributors
 * Copyright (C) 2026 Floodilka Contributors
 * Modified by Floodilka Contributors starting March 2026. See LICENSE and NOTICE.
 */

package integration

import (
	"bytes"
	"encoding/json"
	"net/http"
)

func (c *testClient) requestJSON(method, path string, payload any, token string) (*http.Response, error) {
	var body *bytes.Buffer
	if payload != nil {
		body = &bytes.Buffer{}
		if err := json.NewEncoder(body).Encode(payload); err != nil {
			return nil, err
		}
	} else {
		body = &bytes.Buffer{}
	}

	req, err := http.NewRequest(method, c.baseURL+path, body)
	if err != nil {
		return nil, err
	}

	if payload != nil {
		req.Header.Set("Content-Type", "application/json")
	}
	c.applyCommonHeaders(req)
	if token != "" {
		req.Header.Set("Authorization", token)
	}
	return c.httpClient.Do(req)
}
