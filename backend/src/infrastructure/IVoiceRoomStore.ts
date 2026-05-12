/*
 * SPDX-License-Identifier: AGPL-3.0-or-later
 * Copyright (C) 2020-2026 Fluxer Contributors
 * Copyright (C) 2026 Floodilka Contributors
 * Modified by Floodilka Contributors starting March 2026. See LICENSE and NOTICE.
 */

import type {ChannelID, GuildID} from '~/BrandedTypes';

export abstract class IVoiceRoomStore {
	abstract pinRoomServer(
		guildId: GuildID | undefined,
		channelId: ChannelID,
		regionId: string,
		serverId: string,
		endpoint: string,
	): Promise<{regionId: string; serverId: string; endpoint: string}>;

	abstract getPinnedRoomServer(
		guildId: GuildID | undefined,
		channelId: ChannelID,
	): Promise<{regionId: string; serverId: string; endpoint: string} | null>;

	abstract deleteRoomServer(guildId: GuildID | undefined, channelId: ChannelID): Promise<void>;

	abstract getRegionOccupancy(regionId: string): Promise<Array<string>>;

	abstract getServerOccupancy(regionId: string, serverId: string): Promise<Array<string>>;
}
