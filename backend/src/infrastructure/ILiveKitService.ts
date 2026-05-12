/*
 * SPDX-License-Identifier: AGPL-3.0-or-later
 * Copyright (C) 2020-2026 Fluxer Contributors
 * Copyright (C) 2026 Floodilka Contributors
 * Modified by Floodilka Contributors starting March 2026. See LICENSE and NOTICE.
 */

import type {ChannelID, GuildID, UserID} from '~/BrandedTypes';
import type {VoiceRegionMetadata, VoiceServerRecord} from '~/voice/VoiceModel';

interface CreateTokenParams {
	userId: UserID;
	guildId?: GuildID;
	channelId: ChannelID;
	connectionId: string;
	regionId: string;
	serverId: string;
	mute?: boolean;
	deaf?: boolean;
	canSpeak?: boolean;
	canStream?: boolean;
	canVideo?: boolean;
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

interface DisconnectParticipantParams {
	userId: UserID;
	guildId?: GuildID;
	channelId: ChannelID;
	connectionId: string;
	regionId: string;
	serverId: string;
}

export abstract class ILiveKitService {
	abstract createToken(params: CreateTokenParams): Promise<{token: string; endpoint: string}>;
	abstract updateParticipant(params: UpdateParticipantParams): Promise<void>;
	abstract updateParticipantPermissions(params: UpdateParticipantPermissionsParams): Promise<void>;
	abstract disconnectParticipant(params: DisconnectParticipantParams): Promise<void>;
	abstract getDefaultRegionId(): string | null;
	abstract getRegionMetadata(): Array<VoiceRegionMetadata>;
	abstract getServer(regionId: string, serverId: string): VoiceServerRecord | null;
}
