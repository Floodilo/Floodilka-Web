/*
 * SPDX-License-Identifier: AGPL-3.0-or-later
 * Copyright (C) 2020-2026 Fluxer Contributors
 * Copyright (C) 2026 Floodilka Contributors
 * Modified by Floodilka Contributors starting March 2026. See LICENSE and NOTICE.
 */

package integration

import (
	"context"
	"io"
	"time"
)

func (g *gatewayClient) nextDispatchFromChannel(timeout time.Duration) (gatewayDispatch, error) {
	if timeout <= 0 {
		return gatewayDispatch{}, context.DeadlineExceeded
	}
	timer := time.NewTimer(timeout)
	defer timer.Stop()
	select {
	case dispatch, ok := <-g.dispatchCh:
		if !ok {
			return gatewayDispatch{}, io.EOF
		}
		return dispatch, nil
	case err := <-g.errCh:
		return gatewayDispatch{}, err
	case <-timer.C:
		return gatewayDispatch{}, context.DeadlineExceeded
	}
}
