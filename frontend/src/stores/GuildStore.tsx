/*
 * SPDX-License-Identifier: AGPL-3.0-or-later
 * Copyright (C) 2020-2026 Fluxer Contributors
 * Copyright (C) 2026 Floodilka Contributors
 * Modified by Floodilka Contributors starting March 2026. See LICENSE and NOTICE.
 */

import {makeAutoObservable} from 'mobx';
import {Routes} from '~/Routes';
import {type Guild, type GuildReadyData, GuildRecord} from '~/records/GuildRecord';
import {type GuildRole, GuildRoleRecord} from '~/records/GuildRoleRecord';
import * as RouterUtils from '~/utils/RouterUtils';

class GuildStore {
	guilds: Record<string, GuildRecord> = {};

	constructor() {
		makeAutoObservable(this, {}, {autoBind: true});
	}

	getGuild(guildId: string): GuildRecord | undefined {
		return this.guilds[guildId];
	}

	getGuildIds(): Array<string> {
		return Object.keys(this.guilds);
	}

	getGuildRoles(guildId: string, includeEveryone = false): Array<GuildRoleRecord> {
		const guild = this.guilds[guildId];
		if (!guild) {
			return [];
		}
		return Object.values(guild.roles).filter((role) => includeEveryone || role.id !== guildId);
	}

	getGuilds(): Array<GuildRecord> {
		return Object.values(this.guilds);
	}

	getOwnedGuilds(userId: string): Array<GuildRecord> {
		return Object.values(this.guilds).filter((guild) => guild.ownerId === userId);
	}

	handleConnectionOpen({guilds}: {guilds: Array<GuildReadyData>}): void {
		const availableGuilds = guilds.filter((guild) => !guild.unavailable);

		if (availableGuilds.length === 0) {
			this.guilds = {};
			return;
		}

		this.guilds = availableGuilds.reduce<Record<string, GuildRecord>>((acc, guildData) => {
			acc[guildData.id] = GuildRecord.fromGuildReadyData(guildData);
			return acc;
		}, {});
	}

	handleGuildCreate(guild: GuildReadyData): void {
		if (guild.unavailable) {
			return;
		}

		this.guilds[guild.id] = GuildRecord.fromGuildReadyData(guild);
	}

	handleGuildUpdate(guild: Guild): void {
		const existingGuild = this.guilds[guild.id];
		if (!existingGuild) {
			return;
		}

		this.guilds[guild.id] = new GuildRecord({
			...guild,
			roles: existingGuild.roles,
		});
	}

	handleGuildDelete({guildId, unavailable}: {guildId: string; unavailable?: boolean}): void {
		delete this.guilds[guildId];

		if (!unavailable) {
			const history = RouterUtils.getHistory();
			const currentPath = history?.location.pathname ?? '';
			const guildRoutePrefix = `/channels/${guildId}`;

			if (currentPath.startsWith(guildRoutePrefix)) {
				RouterUtils.transitionTo(Routes.ME);
			}
		}
	}

	private updateGuildWithRoles(
		guildId: string,
		roleUpdater: (roles: Record<string, GuildRoleRecord>) => Record<string, GuildRoleRecord>,
	): void {
		const guild = this.guilds[guildId];
		if (!guild) {
			return;
		}

		const updatedRoles = roleUpdater({...guild.roles});
		this.guilds[guildId] = new GuildRecord({
			...guild.toJSON(),
			roles: updatedRoles,
		});
	}

	handleGuildRoleCreate({guildId, role}: {guildId: string; role: GuildRole}): void {
		this.updateGuildWithRoles(guildId, (roles) => ({
			...roles,
			[role.id]: new GuildRoleRecord(guildId, role),
		}));
	}

	handleGuildRoleDelete({guildId, roleId}: {guildId: string; roleId: string}): void {
		this.updateGuildWithRoles(guildId, (roles) =>
			Object.fromEntries(Object.entries(roles).filter(([id]) => id !== roleId)),
		);
	}

	handleGuildRoleUpdate({guildId, role}: {guildId: string; role: GuildRole}): void {
		this.updateGuildWithRoles(guildId, (roles) => ({
			...roles,
			[role.id]: new GuildRoleRecord(guildId, role),
		}));
	}

	handleGuildRoleUpdateBulk({guildId, roles}: {guildId: string; roles: Array<GuildRole>}): void {
		this.updateGuildWithRoles(guildId, (existingRoles) => {
			const updatedRoles = {...existingRoles};
			for (const role of roles) {
				updatedRoles[role.id] = new GuildRoleRecord(guildId, role);
			}
			return updatedRoles;
		});
	}
}

export default new GuildStore();
