/*
 * SPDX-License-Identifier: AGPL-3.0-or-later
 * Copyright (C) 2020-2026 Fluxer Contributors
 * Copyright (C) 2026 Floodilka Contributors
 * Modified by Floodilka Contributors starting March 2026. See LICENSE and NOTICE.
 */

import type {Context, Next} from 'hono';
import {InvalidApiOriginError} from '~/errors/InvalidApiOriginError';

export const BlockAppOriginMiddleware = async (ctx: Context, next: Next) => {
	const origin = ctx.req.header('origin');
	if (origin === 'https://floodilka.com' || origin === 'https://stage.floodilka.com') {
		throw new InvalidApiOriginError();
	}
	await next();
};
