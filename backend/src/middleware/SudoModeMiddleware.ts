/*
 * SPDX-License-Identifier: AGPL-3.0-or-later
 * Copyright (C) 2020-2026 Fluxer Contributors
 * Copyright (C) 2026 Floodilka Contributors
 * Modified by Floodilka Contributors starting March 2026. See LICENSE and NOTICE.
 */

import {createMiddleware} from 'hono/factory';
import type {HonoEnv} from '~/App';
import {getSudoModeService} from '~/auth/services/SudoModeService';
import {getSudoCookie} from '~/utils/SudoCookieUtils';

export const SUDO_MODE_HEADER = 'X-Floodilka-Sudo-Mode-JWT';

export const SudoModeMiddleware = createMiddleware<HonoEnv>(async (ctx, next) => {
	const user = ctx.get('user');

	ctx.set('sudoModeValid', false);
	ctx.set('sudoModeToken', null);

	if (!user) {
		await next();
		return;
	}

	if (user.isBot) {
		ctx.set('sudoModeValid', true);
		await next();
		return;
	}

	const sudoToken = ctx.req.header(SUDO_MODE_HEADER);

	let tokenToVerify: string | undefined = sudoToken;

	if (!tokenToVerify) {
		tokenToVerify = getSudoCookie(ctx, user.id.toString());
	}

	if (!tokenToVerify) {
		await next();
		return;
	}

	const sudoModeService = getSudoModeService();
	const isValid = await sudoModeService.verifySudoToken(tokenToVerify, user.id);

	if (isValid) {
		ctx.set('sudoModeValid', true);
		ctx.set('sudoModeToken', tokenToVerify);
	}

	await next();
});
