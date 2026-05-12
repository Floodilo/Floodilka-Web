/*
 * SPDX-License-Identifier: AGPL-3.0-or-later
 * Copyright (C) 2020-2026 Fluxer Contributors
 * Copyright (C) 2026 Floodilka Contributors
 * Modified by Floodilka Contributors starting March 2026. See LICENSE and NOTICE.
 */

import type {GuildID, UserID} from '~/BrandedTypes';
import {buildPatchFromData, deleteOneOrMany, executeVersionedUpdate, fetchMany, fetchOne} from '~/database/Cassandra';
import type {UserGuildSettingsRow, UserSettingsRow} from '~/database/CassandraTypes';
import {USER_GUILD_SETTINGS_COLUMNS, USER_SETTINGS_COLUMNS} from '~/database/types/UserTypes';
import {UserGuildSettings, UserSettings} from '~/Models';
import {UserGuildSettings as UserGuildSettingsTable, UserSettings as UserSettingsTable} from '~/Tables';
import type {IUserSettingsRepository} from './IUserSettingsRepository';

const FETCH_USER_SETTINGS_CQL = UserSettingsTable.selectCql({
	where: UserSettingsTable.where.eq('user_id'),
	limit: 1,
});

const FETCH_USER_GUILD_SETTINGS_CQL = UserGuildSettingsTable.selectCql({
	where: [UserGuildSettingsTable.where.eq('user_id'), UserGuildSettingsTable.where.eq('guild_id')],
	limit: 1,
});

const FETCH_ALL_USER_GUILD_SETTINGS_CQL = UserGuildSettingsTable.selectCql({
	where: UserGuildSettingsTable.where.eq('user_id'),
});

export class UserSettingsRepository implements IUserSettingsRepository {
	async deleteAllUserGuildSettings(userId: UserID): Promise<void> {
		await deleteOneOrMany(
			UserGuildSettingsTable.deleteCql({
				where: UserGuildSettingsTable.where.eq('user_id'),
			}),
			{user_id: userId},
		);
	}

	async deleteGuildSettings(userId: UserID, guildId: GuildID): Promise<void> {
		await deleteOneOrMany(
			UserGuildSettingsTable.deleteByPk({
				user_id: userId,
				guild_id: guildId,
			}),
		);
	}

	async deleteUserSettings(userId: UserID): Promise<void> {
		await deleteOneOrMany(UserSettingsTable.deleteByPk({user_id: userId}));
	}

	async findGuildSettings(userId: UserID, guildId: GuildID | null): Promise<UserGuildSettings | null> {
		const settings = await fetchOne<UserGuildSettingsRow>(FETCH_USER_GUILD_SETTINGS_CQL, {
			user_id: userId,
			guild_id: guildId ? guildId : 0n,
		});
		return settings ? new UserGuildSettings(settings) : null;
	}

	async findAllGuildSettings(userId: UserID): Promise<Array<UserGuildSettings>> {
		const rows = await fetchMany<UserGuildSettingsRow>(FETCH_ALL_USER_GUILD_SETTINGS_CQL, {
			user_id: userId,
		});
		return rows.map((row) => new UserGuildSettings(row));
	}

	async findSettings(userId: UserID): Promise<UserSettings | null> {
		const settings = await fetchOne<UserSettingsRow>(FETCH_USER_SETTINGS_CQL, {user_id: userId});
		return settings ? new UserSettings(settings) : null;
	}

	async upsertGuildSettings(settings: UserGuildSettingsRow): Promise<UserGuildSettings> {
		const userId = settings.user_id;
		const guildId = settings.guild_id;

		const result = await executeVersionedUpdate<UserGuildSettingsRow, 'user_id' | 'guild_id'>(
			() => this.findGuildSettings(userId, guildId).then((s) => s?.toRow() ?? null),
			(current) => ({
				pk: {user_id: userId, guild_id: guildId},
				patch: buildPatchFromData(settings, current, USER_GUILD_SETTINGS_COLUMNS, ['user_id', 'guild_id']),
			}),
			UserGuildSettingsTable,
			{onFailure: 'log'},
		);

		return new UserGuildSettings({...settings, version: result.finalVersion ?? 1});
	}

	async upsertSettings(settings: UserSettingsRow): Promise<UserSettings> {
		const userId = settings.user_id;

		const result = await executeVersionedUpdate<UserSettingsRow, 'user_id'>(
			() => this.findSettings(userId).then((s) => s?.toRow() ?? null),
			(current) => ({
				pk: {user_id: userId},
				patch: buildPatchFromData(settings, current, USER_SETTINGS_COLUMNS, ['user_id']),
			}),
			UserSettingsTable,
			{onFailure: 'log'},
		);

		return new UserSettings({...settings, version: result.finalVersion ?? 1});
	}
}
