/*
 * SPDX-License-Identifier: AGPL-3.0-or-later
 * Copyright (C) 2020-2026 Fluxer Contributors
 * Copyright (C) 2026 Floodilka Contributors
 * Modified by Floodilka Contributors starting March 2026. See LICENSE and NOTICE.
 */

import {makeAutoObservable, observable} from 'mobx';
import type {GuildReadyData} from '~/records/GuildRecord';

class GuildAvailabilityStore {
	unavailableGuilds: Set<string> = observable.set();

	constructor() {
		makeAutoObservable(
			this,
			{
				unavailableGuilds: false,
			},
			{autoBind: true},
		);
	}

	setGuildAvailable(guildId: string): void {
		if (this.unavailableGuilds.has(guildId)) {
			this.unavailableGuilds.delete(guildId);
		}
	}

	setGuildUnavailable(guildId: string): void {
		if (!this.unavailableGuilds.has(guildId)) {
			this.unavailableGuilds.add(guildId);
		}
	}

	handleGuildAvailability(guildId: string, unavailable = false): void {
		if (unavailable) {
			this.setGuildUnavailable(guildId);
		} else {
			this.setGuildAvailable(guildId);
		}
	}

	loadUnavailableGuilds(guilds: ReadonlyArray<GuildReadyData>): void {
		const unavailableGuildIds = guilds.filter((guild) => guild.unavailable).map((guild) => guild.id);
		this.unavailableGuilds.clear();
		unavailableGuildIds.forEach((id) => this.unavailableGuilds.add(id));
	}

	get totalUnavailableGuilds(): number {
		return this.unavailableGuilds.size;
	}
}

export default new GuildAvailabilityStore();
