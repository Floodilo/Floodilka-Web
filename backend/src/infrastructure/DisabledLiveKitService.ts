/*
 * SPDX-License-Identifier: AGPL-3.0-or-later
 * Copyright (C) 2020-2026 Fluxer Contributors
 * Copyright (C) 2026 Floodilka Contributors
 * Modified by Floodilka Contributors starting March 2026. See LICENSE and NOTICE.
 */

import type {ChannelID, GuildID, UserID} from '~/BrandedTypes';
import type {VoiceRegionMetadata, VoiceServerRecord} from '~/voice/VoiceModel';
import type {ILiveKitService} from './ILiveKitService';

interface CreateTokenParams {
	userId: UserID;
	guildId?: GuildID;
	channelId: ChannelID;
	connectionId: string;
	regionId: string;
	serverId: string;
	mute?: boolean;
	deaf?: boolean;
}

interface UpdateParticipantParams {
	userId: UserID;
	guildId?: GuildID;
	channelId: ChannelID;
	connectionId: string;
	regionId: string;
	serverId: string;
	mute?: boolean;
	deaf?: boolean;
}

interface DisconnectParticipantParams {
	userId: UserID;
	guildId?: GuildID;
	channelId: ChannelID;
	connectionId: string;
	regionId: string;
	serverId: string;
}

interface UpdateParticipantPermissionsParams {
	userId: UserID;
	guildId?: GuildID;
	channelId: ChannelID;
	connectionId: string;
	regionId: string;
	serverId: string;
	canSpeak: boolean;
	canStream: boolean;
	canVideo: boolean;
}

export class DisabledLiveKitService implements ILiveKitService {
	async createToken(_params: CreateTokenParams): Promise<{token: string; endpoint: string}> {
		throw new Error('Voice is disabled');
	}

	async updateParticipant(_params: UpdateParticipantParams): Promise<void> {}

	async updateParticipantPermissions(_params: UpdateParticipantPermissionsParams): Promise<void> {}

	async disconnectParticipant(_params: DisconnectParticipantParams): Promise<void> {}

	getDefaultRegionId(): string | null {
		return null;
	}

	getRegionMetadata(): Array<VoiceRegionMetadata> {
		return [];
	}

	getServer(_regionId: string, _serverId: string): VoiceServerRecord | null {
		return null;
	}
}
