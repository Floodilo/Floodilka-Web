/*
 * SPDX-License-Identifier: AGPL-3.0-or-later
 * Copyright (C) 2020-2026 Fluxer Contributors
 * Copyright (C) 2026 Floodilka Contributors
 * Modified by Floodilka Contributors starting March 2026. See LICENSE and NOTICE.
 */

import type {GuildID, UserID} from '~/BrandedTypes';
import {mapGuildMemberToResponse} from '~/guild/GuildModel';
import type {IGatewayService} from '~/infrastructure/IGatewayService';
import type {UserCacheService} from '~/infrastructure/UserCacheService';
import type {GuildMember} from '~/Models';
import type {RequestCache} from '~/middleware/RequestCacheMiddleware';

export class GuildMemberEventService {
	constructor(
		private readonly gatewayService: IGatewayService,
		private readonly userCacheService: UserCacheService,
	) {}

	async dispatchGuildMemberAdd({
		member,
		requestCache,
	}: {
		member: GuildMember;
		requestCache: RequestCache;
	}): Promise<void> {
		await this.gatewayService.dispatchGuild({
			guildId: member.guildId,
			event: 'GUILD_MEMBER_ADD',
			data: await mapGuildMemberToResponse(member, this.userCacheService, requestCache),
		});
	}

	async dispatchGuildMemberUpdate({
		guildId,
		member,
		requestCache,
	}: {
		guildId: GuildID;
		member: GuildMember;
		requestCache: RequestCache;
	}): Promise<void> {
		const memberResponse = await mapGuildMemberToResponse(member, this.userCacheService, requestCache);
		await this.gatewayService.dispatchGuild({
			guildId,
			event: 'GUILD_MEMBER_UPDATE',
			data: memberResponse,
		});
	}

	async dispatchGuildMemberRemove({guildId, userId}: {guildId: GuildID; userId: UserID}): Promise<void> {
		await this.gatewayService.dispatchGuild({
			guildId,
			event: 'GUILD_MEMBER_REMOVE',
			data: {user: {id: userId.toString()}},
		});
	}
}
