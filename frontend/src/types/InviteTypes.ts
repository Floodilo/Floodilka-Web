/*
 * SPDX-License-Identifier: AGPL-3.0-or-later
 * Copyright (C) 2020-2026 Fluxer Contributors
 * Copyright (C) 2026 Floodilka Contributors
 * Modified by Floodilka Contributors starting March 2026. See LICENSE and NOTICE.
 */

import {InviteTypes} from '~/Constants';
import type {Channel} from '~/records/ChannelRecord';
import type {Guild} from '~/records/GuildRecord';
import type {UserPartial} from '~/records/UserRecord';
import type {PackSummary} from '~/types/PackTypes';

export type InviteTypeValue = (typeof InviteTypes)[keyof typeof InviteTypes];

export interface InviteBase {
	code: string;
	type: InviteTypeValue;
	inviter?: UserPartial | null;
	expires_at: string | null;
	temporary: boolean;
}

export interface GuildInvite extends InviteBase {
	type: typeof InviteTypes.GUILD;
	guild: Guild;
	channel: Channel;
	member_count: number;
	presence_count: number;
	uses?: number;
	max_uses?: number;
	created_at?: string;
}

export interface GroupDmInvite extends InviteBase {
	type: typeof InviteTypes.GROUP_DM;
	channel: Channel;
	member_count: number;
}

export type PackInviteType = typeof InviteTypes.EMOJI_PACK | typeof InviteTypes.STICKER_PACK;

export interface PackInvite extends InviteBase {
	type: PackInviteType;
	pack: PackSummary & {creator: UserPartial};
}

export type Invite = GuildInvite | GroupDmInvite | PackInvite;

export const isGuildInvite = (invite: Invite): invite is GuildInvite => invite.type === InviteTypes.GUILD;
export const isGroupDmInvite = (invite: Invite): invite is GroupDmInvite => invite.type === InviteTypes.GROUP_DM;
export const isPackInvite = (invite: Invite): invite is PackInvite =>
	invite.type === InviteTypes.EMOJI_PACK || invite.type === InviteTypes.STICKER_PACK;
