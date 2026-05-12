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

func (g *gatewayClient) nextDispatch(timeout time.Duration) (gatewayDispatch, error) {
	if dispatch, ok := g.popPending(); ok {
		return dispatch, nil
	}
	return g.nextDispatchFromChannel(timeout)
}
