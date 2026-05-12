/*
 * SPDX-License-Identifier: AGPL-3.0-or-later
 * Copyright (C) 2020-2026 Fluxer Contributors
 * Copyright (C) 2026 Floodilka Contributors
 * Modified by Floodilka Contributors starting March 2026. See LICENSE and NOTICE.
 */

import type {UserID} from '~/BrandedTypes';
import type {IGatewayService} from '~/infrastructure/IGatewayService';
import type {UserCacheService} from '~/infrastructure/UserCacheService';
import type {User} from '~/Models';
import {mapUserToPrivateResponse} from '~/user/UserModel';
import {invalidateUserCache} from '../UserCacheHelpers';

export interface BaseUserUpdatePropagatorDeps {
	userCacheService: UserCacheService;
	gatewayService: IGatewayService;
}

export class BaseUserUpdatePropagator {
	constructor(protected readonly baseDeps: BaseUserUpdatePropagatorDeps) {}

	async dispatchUserUpdate(user: User): Promise<void> {
		await this.baseDeps.gatewayService.dispatchPresence({
			userId: user.id,
			event: 'USER_UPDATE',
			data: mapUserToPrivateResponse(user),
		});
	}

	async invalidateUserCache(userId: UserID): Promise<void> {
		await invalidateUserCache({
			userId,
			userCacheService: this.baseDeps.userCacheService,
		});
	}
}
