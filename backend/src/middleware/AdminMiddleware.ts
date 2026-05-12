/*
 * SPDX-License-Identifier: AGPL-3.0-or-later
 * Copyright (C) 2020-2026 Fluxer Contributors
 * Copyright (C) 2026 Floodilka Contributors
 * Modified by Floodilka Contributors starting March 2026. See LICENSE and NOTICE.
 */

import {createMiddleware} from 'hono/factory';
import type {HonoEnv} from '~/App';
import {AdminACLs} from '~/Constants';
import {MissingACLError, MissingPermissionsError, UnauthorizedError} from '~/Errors';
import {Logger} from '~/Logger';

export const requireAdminACL = (requiredACL: string) =>
	createMiddleware<HonoEnv>(async (ctx, next) => {
		const adminUser = ctx.get('user');
		if (!adminUser) throw new UnauthorizedError();

		const tokenType = ctx.get('authTokenType');
		if (tokenType !== 'bearer' && tokenType !== 'session') throw new UnauthorizedError();

		Logger.debug(
			{
				adminUserId: adminUser.id.toString(),
				acls: Array.from(adminUser.acls),
				requiredACL,
			},
			'Checking admin ACL requirements',
		);
		if (!adminUser.acls.has(AdminACLs.AUTHENTICATE) && !adminUser.acls.has(AdminACLs.WILDCARD)) {
			throw new MissingPermissionsError();
		}

		if (!adminUser.acls.has(requiredACL) && !adminUser.acls.has(AdminACLs.WILDCARD)) {
			throw new MissingACLError(requiredACL);
		}

		ctx.set('adminUserId', adminUser.id);
		ctx.set('adminUserAcls', adminUser.acls);
		await next();
	});

export const requireAnyAdminACL = (requiredACLs: Array<string>) =>
	createMiddleware<HonoEnv>(async (ctx, next) => {
		const adminUser = ctx.get('user');
		if (!adminUser) throw new UnauthorizedError();

		const tokenType = ctx.get('authTokenType');
		if (tokenType !== 'bearer' && tokenType !== 'session') throw new UnauthorizedError();

		Logger.debug(
			{
				adminUserId: adminUser.id.toString(),
				acls: Array.from(adminUser.acls),
				requiredACLs,
			},
			'Checking admin ACL requirements (any)',
		);
		if (!adminUser.acls.has(AdminACLs.AUTHENTICATE) && !adminUser.acls.has(AdminACLs.WILDCARD)) {
			throw new MissingPermissionsError();
		}

		const hasAny = adminUser.acls.has(AdminACLs.WILDCARD) || requiredACLs.some((acl) => adminUser.acls.has(acl));

		if (!hasAny) {
			throw new MissingACLError(requiredACLs[0] ?? AdminACLs.AUTHENTICATE);
		}

		ctx.set('adminUserId', adminUser.id);
		ctx.set('adminUserAcls', adminUser.acls);
		await next();
	});
