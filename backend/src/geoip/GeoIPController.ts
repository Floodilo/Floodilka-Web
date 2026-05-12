/*
 * SPDX-License-Identifier: AGPL-3.0-or-later
 * Copyright (C) 2020-2026 Fluxer Contributors
 * Copyright (C) 2026 Floodilka Contributors
 * Modified by Floodilka Contributors starting March 2026. See LICENSE and NOTICE.
 */

import type {Hono} from 'hono';
import type {HonoEnv} from '~/App';
import {extractClientIp, lookupGeoip} from '~/utils/IpUtils';

export function GeoIPController(app: Hono<HonoEnv>) {
	app.get('/geoip', async (ctx) => {
		const ip = extractClientIp(ctx.req.raw) ?? '127.0.0.1';
		const geoip = await lookupGeoip(ip);

		return ctx.json({
			countryCode: geoip.countryCode ?? 'US',
			regionCode: geoip.region ?? null,
			latitude: geoip.latitude != null ? String(geoip.latitude) : '0',
			longitude: geoip.longitude != null ? String(geoip.longitude) : '0',
		});
	});
}
