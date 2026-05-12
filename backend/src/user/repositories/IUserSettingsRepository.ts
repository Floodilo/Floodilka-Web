/*
 * SPDX-License-Identifier: AGPL-3.0-or-later
 * Copyright (C) 2020-2026 Fluxer Contributors
 * Copyright (C) 2026 Floodilka Contributors
 * Modified by Floodilka Contributors starting March 2026. See LICENSE and NOTICE.
 */

import type {GuildID, UserID} from '~/BrandedTypes';
import type {UserGuildSettingsRow, UserSettingsRow} from '~/database/CassandraTypes';
import type {UserGuildSettings, UserSettings} from '~/Models';

export interface IUserSettingsRepository {
	findSettings(userId: UserID): Promise<UserSettings | null>;
	upsertSettings(settings: UserSettingsRow): Promise<UserSettings>;
	deleteUserSettings(userId: UserID): Promise<void>;

	findGuildSettings(userId: UserID, guildId: GuildID | null): Promise<UserGuildSettings | null>;
	findAllGuildSettings(userId: UserID): Promise<Array<UserGuildSettings>>;
	upsertGuildSettings(settings: UserGuildSettingsRow): Promise<UserGuildSettings>;
	deleteGuildSettings(userId: UserID, guildId: GuildID): Promise<void>;
	deleteAllUserGuildSettings(userId: UserID): Promise<void>;
}
