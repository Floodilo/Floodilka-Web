/*
 * SPDX-License-Identifier: AGPL-3.0-or-later
 * Copyright (C) 2020-2026 Fluxer Contributors
 * Copyright (C) 2026 Floodilka Contributors
 * Modified by Floodilka Contributors starting March 2026. See LICENSE and NOTICE.
 */

import {GuildFeatures} from '~/Constants';
import type {Guild, GuildRecord} from '~/records/GuildRecord';
import type {Invite} from '~/records/MessageRecord';
import AuthenticationStore from '~/stores/AuthenticationStore';
import GuildMemberStore from '~/stores/GuildMemberStore';
import {isGuildInvite} from '~/types/InviteTypes';

const normalizeFeatures = (features?: Iterable<string> | null): Array<string> => {
	if (!features) return [];
	if (Array.isArray(features)) return features;
	return Array.from(features);
};

export interface GuildInviteActionState {
	guildId: string | null;
	isMember: boolean;
	presenceCount: number;
	memberCount: number;
	isInvitesDisabled: boolean;
	features: Array<string>;
}

export enum GuildInvitePrimaryAction {
	JoinCommunity = 'join',
	GoToCommunity = 'go',
	InvitesDisabled = 'disabled',
}

export const getGuildInviteActionState = (params: {
	invite?: Invite | null;
	guild?: GuildRecord | Guild | null;
}): GuildInviteActionState => {
	const inviteGuild = params.invite && isGuildInvite(params.invite) ? params.invite.guild : null;
	const guildRecord = params.guild ?? inviteGuild ?? null;
	const guildId = guildRecord?.id ?? null;
	const currentUserId = AuthenticationStore.currentUserId;
	const isMember = Boolean(guildId && currentUserId && GuildMemberStore.getMember(guildId, currentUserId));
	const presenceCount = params.invite && isGuildInvite(params.invite) ? (params.invite.presence_count ?? 0) : 0;
	const memberCount = params.invite && isGuildInvite(params.invite) ? (params.invite.member_count ?? 0) : 0;
	const features = normalizeFeatures(guildRecord?.features ?? inviteGuild?.features);

	return {
		guildId,
		isMember,
		presenceCount,
		memberCount,
		features,
		isInvitesDisabled: features.includes(GuildFeatures.INVITES_DISABLED),
	};
};

export const getGuildInvitePrimaryAction = (state: GuildInviteActionState): GuildInvitePrimaryAction => {
	if (state.isInvitesDisabled && !state.isMember) {
		return GuildInvitePrimaryAction.InvitesDisabled;
	}
	if (state.isMember) {
		return GuildInvitePrimaryAction.GoToCommunity;
	}
	return GuildInvitePrimaryAction.JoinCommunity;
};

export const isGuildInviteActionDisabled = (state: GuildInviteActionState): boolean =>
	state.isInvitesDisabled && !state.isMember;
