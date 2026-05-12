/*
 * SPDX-License-Identifier: AGPL-3.0-or-later
 * Copyright (C) 2020-2026 Fluxer Contributors
 * Copyright (C) 2026 Floodilka Contributors
 * Modified by Floodilka Contributors starting March 2026. See LICENSE and NOTICE.
 */

import type {ChannelID, GuildID} from '~/BrandedTypes';

export class InMemoryVoiceRoomStore {
	async pinRoomServer(
		_guildId: GuildID | undefined,
		_channelId: ChannelID,
		regionId: string,
		serverId: string,
		endpoint: string,
	): Promise<{regionId: string; serverId: string; endpoint: string}> {
		return {regionId, serverId, endpoint};
	}

	async getPinnedRoomServer(
		_guildId: GuildID | undefined,
		_channelId: ChannelID,
	): Promise<{regionId: string; serverId: string; endpoint: string} | null> {
		return null;
	}

	async deleteRoomServer(_guildId: GuildID | undefined, _channelId: ChannelID): Promise<void> {}

	async getRegionOccupancy(_regionId: string): Promise<Array<string>> {
		return [];
	}

	async getServerOccupancy(_regionId: string, _serverId: string): Promise<Array<string>> {
		return [];
	}
}
