/*
 * SPDX-License-Identifier: AGPL-3.0-or-later
 * Copyright (C) 2020-2026 Fluxer Contributors
 * Copyright (C) 2026 Floodilka Contributors
 * Modified by Floodilka Contributors starting March 2026. See LICENSE and NOTICE.
 */

package integration

import (
	"context"
	"encoding/json"
	"errors"
	"fmt"
	"time"
)

func (g *gatewayClient) NextDispatch(timeout time.Duration) (string, json.RawMessage) {
	dispatch, err := g.nextDispatch(timeout)
	if err != nil {
		if errors.Is(err, context.DeadlineExceeded) {
			return "", nil
		}
		panic(fmt.Sprintf("failed to get next dispatch: %v", err))
	}
	return dispatch.Type, dispatch.Data
}
