/*
 * SPDX-License-Identifier: AGPL-3.0-or-later
 * Copyright (C) 2020-2026 Fluxer Contributors
 * Copyright (C) 2026 Floodilka Contributors
 * Modified by Floodilka Contributors starting March 2026. See LICENSE and NOTICE.
 */

import type {GuildID, UserID} from '~/BrandedTypes';

interface VoiceRestriction {
	vipOnly: boolean;
	requiredGuildFeatures: Set<string>;
	allowedGuildIds: Set<GuildID>;
	allowedUserIds: Set<UserID>;
}

export interface VoiceRegionRecord {
	id: string;
	name: string;
	emoji: string;
	latitude: number;
	longitude: number;
	isDefault: boolean;
	restrictions: VoiceRestriction;
	createdAt: Date | null;
	updatedAt: Date | null;
}

export interface VoiceServerRecord {
	regionId: string;
	serverId: string;
	endpoint: string;
	apiKey: string;
	apiSecret: string;
	isActive: boolean;
	restrictions: VoiceRestriction;
	createdAt: Date | null;
	updatedAt: Date | null;
}

export interface VoiceRegionWithServers extends VoiceRegionRecord {
	servers: Array<VoiceServerRecord>;
}

export interface VoiceRegionMetadata {
	id: string;
	name: string;
	emoji: string;
	latitude: number;
	longitude: number;
	isDefault: boolean;
	vipOnly: boolean;
	requiredGuildFeatures: Array<string>;
}

export interface VoiceRegionAvailability extends VoiceRegionMetadata {
	isAccessible: boolean;
	restrictions: VoiceRestriction;
	serverCount: number;
	activeServerCount: number;
}
