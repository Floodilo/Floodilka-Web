/*
 * SPDX-License-Identifier: AGPL-3.0-or-later
 * Copyright (C) 2020-2026 Fluxer Contributors
 * Copyright (C) 2026 Floodilka Contributors
 * Modified by Floodilka Contributors starting March 2026. See LICENSE and NOTICE.
 */

import type {GuildID} from '~/BrandedTypes';
import {mapGuildToGuildResponse} from '~/guild/GuildModel';
import type {IGatewayService} from '~/infrastructure/IGatewayService';
import type {Guild} from '~/Models';

interface AdminGuildUpdatePropagatorDeps {
	gatewayService: IGatewayService;
}

export class AdminGuildUpdatePropagator {
	constructor(private readonly deps: AdminGuildUpdatePropagatorDeps) {}

	async dispatchGuildUpdate(guildId: GuildID, updatedGuild: Guild): Promise<void> {
		const {gatewayService} = this.deps;
		await gatewayService.dispatchGuild({
			guildId,
			event: 'GUILD_UPDATE',
			data: mapGuildToGuildResponse(updatedGuild),
		});
	}
}
