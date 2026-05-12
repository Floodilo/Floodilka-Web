/*
 * SPDX-License-Identifier: AGPL-3.0-or-later
 * Copyright (C) 2020-2026 Fluxer Contributors
 * Copyright (C) 2026 Floodilka Contributors
 * Modified by Floodilka Contributors starting March 2026. See LICENSE and NOTICE.
 */

import type {RouteRateLimitConfig} from '~/middleware/RateLimitMiddleware';

export type RateLimitSection = Record<string, RouteRateLimitConfig>;

export function mergeRateLimitSections(...sections: ReadonlyArray<RateLimitSection>): RateLimitSection {
	return Object.assign({}, ...sections);
}
