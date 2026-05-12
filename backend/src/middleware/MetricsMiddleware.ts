/*
 * SPDX-License-Identifier: AGPL-3.0-or-later
 * Copyright (C) 2020-2026 Fluxer Contributors
 * Copyright (C) 2026 Floodilka Contributors
 * Modified by Floodilka Contributors starting March 2026. See LICENSE and NOTICE.
 */

import {createMiddleware} from 'hono/factory';
import type {HonoEnv} from '~/App';
import {getMetricsService} from '~/infrastructure/MetricsService';

function normalizePath(path: string): string {
	return path
		.replace(/\/\d{17,20}/g, '/:id')
		.replace(/\/[a-f0-9]{8}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{12}/gi, '/:uuid')
		.replace(/\/[A-Za-z0-9_-]{6,}/g, (match) => {
			if (match.match(/^\/[0-9]+$/)) {
				return '/:id';
			}
			return match;
		});
}

export const MetricsMiddleware = createMiddleware<HonoEnv>(async (ctx, next) => {
	const metrics = getMetricsService();
	if (!metrics.isEnabled()) {
		await next();
		return;
	}

	const start = performance.now();
	const method = ctx.req.method;
	const path = new URL(ctx.req.url).pathname;

	try {
		await next();
	} finally {
		const durationMs = performance.now() - start;
		const normalizedPath = normalizePath(path);
		const status = ctx.res.status;

		metrics.histogram({
			name: 'api.latency',
			dimensions: {
				method,
				path: normalizedPath,
				status: String(status),
			},
			valueMs: durationMs,
		});

		if (status >= 200 && status < 300) {
			metrics.counter({
				name: 'api.request.2xx',
				dimensions: {
					method,
					path: normalizedPath,
					status: String(status),
				},
				value: 1,
			});
		} else if (status >= 400 && status < 500) {
			metrics.counter({
				name: 'api.request.4xx',
				dimensions: {
					method,
					path: normalizedPath,
					status: String(status),
				},
				value: 1,
			});
		} else if (status >= 500 && status < 600) {
			metrics.counter({
				name: 'api.request.5xx',
				dimensions: {
					method,
					path: normalizedPath,
					status: String(status),
				},
				value: 1,
			});
		}
	}
});
