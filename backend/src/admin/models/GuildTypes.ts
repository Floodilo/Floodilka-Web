/*
 * SPDX-License-Identifier: AGPL-3.0-or-later
 * Copyright (C) 2020-2026 Fluxer Contributors
 * Copyright (C) 2026 Floodilka Contributors
 * Modified by Floodilka Contributors starting March 2026. See LICENSE and NOTICE.
 */

import type {Guild} from '~/Models';
import {createStringType, Int64Type, z} from '~/Schema';

export const mapGuildToAdminResponse = (guild: Guild): GuildAdminResponse => ({
	id: guild.id.toString(),
	name: guild.name,
	features: Array.from(guild.features),
	owner_id: guild.ownerId.toString(),
	icon: guild.iconHash,
	banner: guild.bannerHash,
	member_count: guild.memberCount,
});

export const GuildAdminResponse = z.object({
	id: z.string(),
	name: z.string(),
	features: z.array(z.string()),
	owner_id: z.string(),
	icon: z.string().nullable(),
	banner: z.string().nullable(),
	member_count: z.number(),
});

export type GuildAdminResponse = z.infer<typeof GuildAdminResponse>;

export const mapGuildsToAdminResponse = (guilds: Array<Guild>): GuildsAdminResponse => {
	return {
		guilds: [
			...guilds.map((guild) => {
				return {
					id: guild.id.toString(),
					name: guild.name,
					features: Array.from(guild.features),
					owner_id: guild.ownerId.toString(),
					icon: guild.iconHash,
					banner: guild.bannerHash,
					member_count: guild.memberCount,
				};
			}),
		],
	};
};

const ListGuildsAdminResponse = z.object({
	guilds: z.array(GuildAdminResponse),
});

type GuildsAdminResponse = z.infer<typeof ListGuildsAdminResponse>;

export const ListUserGuildsRequest = z.object({
	user_id: Int64Type,
});

export type ListUserGuildsRequest = z.infer<typeof ListUserGuildsRequest>;

export const LookupGuildRequest = z.object({
	guild_id: Int64Type,
});

export type LookupGuildRequest = z.infer<typeof LookupGuildRequest>;

export const ListGuildMembersRequest = z.object({
	guild_id: Int64Type,
	limit: z.number().default(50),
	offset: z.number().default(0),
});

export type ListGuildMembersRequest = z.infer<typeof ListGuildMembersRequest>;

export const SearchGuildsRequest = z.object({
	query: createStringType(1, 1024).optional(),
	limit: z.number().default(50),
	offset: z.number().default(0),
});

export type SearchGuildsRequest = z.infer<typeof SearchGuildsRequest>;

export const ReloadGuildRequest = z.object({
	guild_id: Int64Type,
});

export type ReloadGuildRequest = z.infer<typeof ReloadGuildRequest>;

export const ShutdownGuildRequest = z.object({
	guild_id: Int64Type,
});

export type ShutdownGuildRequest = z.infer<typeof ShutdownGuildRequest>;

export const GetProcessMemoryStatsRequest = z.object({
	limit: z.number().int().min(1).max(100).default(25),
});

export type GetProcessMemoryStatsRequest = z.infer<typeof GetProcessMemoryStatsRequest>;
