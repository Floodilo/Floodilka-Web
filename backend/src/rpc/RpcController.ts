/*
 * SPDX-License-Identifier: AGPL-3.0-or-later
 * Copyright (C) 2020-2026 Fluxer Contributors
 * Copyright (C) 2026 Floodilka Contributors
 * Modified by Floodilka Contributors starting March 2026. See LICENSE and NOTICE.
 */

import {timingSafeEqual} from 'node:crypto';
import {createMiddleware} from 'hono/factory';
import type {HonoApp, HonoEnv} from '~/App';
import {Config} from '~/Config';
import {UnauthorizedError} from '~/Errors';
import {RpcRequest} from '~/rpc/RpcModel';
import {Validator} from '~/Validator';

const InternalNetworkRequired = createMiddleware<HonoEnv>(async (ctx, next) => {
	const authHeader = ctx.req.header('Authorization');
	const expectedAuth = `Bearer ${Config.gateway.rpcSecret}`;
	if (!authHeader) {
		throw new UnauthorizedError();
	}
	const authBuffer = Buffer.from(authHeader, 'utf8');
	const expectedBuffer = Buffer.from(expectedAuth, 'utf8');
	if (authBuffer.length !== expectedBuffer.length || !timingSafeEqual(authBuffer, expectedBuffer)) {
		throw new UnauthorizedError();
	}
	await next();
});

export const RpcController = (app: HonoApp) => {
	app.post('/_rpc', InternalNetworkRequired, Validator('json', RpcRequest), async (ctx) => {
		return ctx.json(
			await ctx
				.get('rpcService')
				.handleRpcRequest({request: ctx.req.valid('json'), requestCache: ctx.get('requestCache')}),
		);
	});
};
