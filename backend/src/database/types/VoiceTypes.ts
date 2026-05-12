/*
 * SPDX-License-Identifier: AGPL-3.0-or-later
 * Copyright (C) 2020-2026 Fluxer Contributors
 * Copyright (C) 2026 Floodilka Contributors
 * Modified by Floodilka Contributors starting March 2026. See LICENSE and NOTICE.
 */

export interface VoiceRegionRow {
	id: string;
	name: string;
	emoji: string;
	latitude: number;
	longitude: number;
	is_default: boolean | null;
	vip_only: boolean | null;
	required_guild_features: Set<string> | null;
	allowed_guild_ids: Set<bigint> | null;
	allowed_user_ids: Set<bigint> | null;
	created_at: Date | null;
	updated_at: Date | null;
}

export const VOICE_REGION_COLUMNS = [
	'id',
	'name',
	'emoji',
	'latitude',
	'longitude',
	'is_default',
	'vip_only',
	'required_guild_features',
	'allowed_guild_ids',
	'allowed_user_ids',
	'created_at',
	'updated_at',
] as const satisfies ReadonlyArray<keyof VoiceRegionRow>;

export interface VoiceServerRow {
	region_id: string;
	server_id: string;
	endpoint: string;
	api_key: string;
	api_secret: string;
	is_active: boolean | null;
	vip_only: boolean | null;
	required_guild_features: Set<string> | null;
	allowed_guild_ids: Set<bigint> | null;
	allowed_user_ids: Set<bigint> | null;
	created_at: Date | null;
	updated_at: Date | null;
}

export const VOICE_SERVER_COLUMNS = [
	'region_id',
	'server_id',
	'endpoint',
	'api_key',
	'api_secret',
	'is_active',
	'vip_only',
	'required_guild_features',
	'allowed_guild_ids',
	'allowed_user_ids',
	'created_at',
	'updated_at',
] as const satisfies ReadonlyArray<keyof VoiceServerRow>;
