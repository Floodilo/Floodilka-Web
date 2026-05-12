/*
 * SPDX-License-Identifier: AGPL-3.0-or-later
 * Copyright (C) 2020-2026 Fluxer Contributors
 * Copyright (C) 2026 Floodilka Contributors
 * Modified by Floodilka Contributors starting March 2026. See LICENSE and NOTICE.
 */

package integration

type klipyGIF struct {
	ID       string `json:"id"`
	Title    string `json:"title"`
	URL      string `json:"url"`
	Src      string `json:"src"`
	ProxySrc string `json:"proxy_src"`
	Width    int    `json:"width"`
	Height   int    `json:"height"`
}

type registerKlipyShareRequest struct {
	ID     string  `json:"id"`
	Q      *string `json:"q"`
	Locale string  `json:"locale,omitempty"`
}
