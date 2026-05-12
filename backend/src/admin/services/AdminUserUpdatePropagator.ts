/*
 * SPDX-License-Identifier: AGPL-3.0-or-later
 * Copyright (C) 2020-2026 Fluxer Contributors
 * Copyright (C) 2026 Floodilka Contributors
 * Modified by Floodilka Contributors starting March 2026. See LICENSE and NOTICE.
 */

import type {UserID} from '~/BrandedTypes';
import {mapGuildMemberToResponse} from '~/guild/GuildModel';
import type {IGuildRepository} from '~/guild/IGuildRepository';
import type {IGatewayService} from '~/infrastructure/IGatewayService';
import type {UserCacheService} from '~/infrastructure/UserCacheService';
import type {User} from '~/Models';
import type {RequestCache} from '~/middleware/RequestCacheMiddleware';
import type {IUserRepository} from '~/user/IUserRepository';
import {BaseUserUpdatePropagator} from '~/user/services/BaseUserUpdatePropagator';
import {hasPartialUserFieldsChanged} from '~/user/UserMappers';

interface AdminUserUpdatePropagatorDeps {
	userCacheService: UserCacheService;
	userRepository: IUserRepository;
	guildRepository: IGuildRepository;
	gatewayService: IGatewayService;
}

export class AdminUserUpdatePropagator extends BaseUserUpdatePropagator {
	constructor(private readonly deps: AdminUserUpdatePropagatorDeps) {
		super({
			userCacheService: deps.userCacheService,
			gatewayService: deps.gatewayService,
		});
	}

	async propagateUserUpdate({
		userId,
		oldUser,
		updatedUser,
	}: {
		userId: UserID;
		oldUser: User;
		updatedUser: User;
	}): Promise<void> {
		await this.dispatchUserUpdate(updatedUser);

		if (hasPartialUserFieldsChanged(oldUser, updatedUser)) {
			await this.invalidateUserCache(userId);
			await this.propagateToGuilds(userId);
		}
	}

	private async propagateToGuilds(userId: UserID): Promise<void> {
		const {userRepository, guildRepository, gatewayService, userCacheService} = this.deps;

		const guildIds = await userRepository.getUserGuildIds(userId);
		if (guildIds.length === 0) {
			return;
		}

		const requestCache: RequestCache = {
			userPartials: new Map(),
			clear() {
				this.userPartials.clear();
			},
		};

		for (const guildId of guildIds) {
			const member = await guildRepository.getMember(guildId, userId);
			if (!member) {
				continue;
			}

			const memberResponse = await mapGuildMemberToResponse(member, userCacheService, requestCache);
			await gatewayService.dispatchGuild({
				guildId,
				event: 'GUILD_MEMBER_UPDATE',
				data: memberResponse,
			});
		}

		requestCache.clear();
	}
}
