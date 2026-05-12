/*
 * SPDX-License-Identifier: AGPL-3.0-or-later
 * Copyright (C) 2020-2026 Fluxer Contributors
 * Copyright (C) 2026 Floodilka Contributors
 * Modified by Floodilka Contributors starting March 2026. See LICENSE and NOTICE.
 */

import {GuildMemberProfileFlags} from '~/Constants';
import type {GuildRoleRecord} from '~/records/GuildRoleRecord';
import type {UserPartial} from '~/records/UserRecord';
import {UserRecord} from '~/records/UserRecord';
import AuthenticationStore from '~/stores/AuthenticationStore';
import GuildStore from '~/stores/GuildStore';
import UserStore from '~/stores/UserStore';
import * as ColorUtils from '~/utils/ColorUtils';

export type GuildMember = Readonly<{
	user: UserPartial;
	nick?: string | null;
	avatar?: string | null;
	banner?: string | null;
	roles: ReadonlyArray<string>;
	joined_at: string;
	join_source_type?: number | null;
	source_invite_code?: string | null;
	inviter_id?: string | null;
	mute?: boolean;
	deaf?: boolean;
	communication_disabled_until?: string | null;
	profile_flags?: number | null;
}>;

export class GuildMemberRecord {
	readonly guildId: string;
	readonly userId: string;
	private readonly userFallback: UserRecord;
	readonly nick: string | null;
	readonly avatar: string | null;
	readonly banner: string | null;
	readonly roles: ReadonlySet<string>;
	readonly joinedAt: Date;
	readonly joinSourceType: number | null;
	readonly sourceInviteCode: string | null;
	readonly inviterId: string | null;
	readonly mute: boolean;
	readonly deaf: boolean;
	readonly communicationDisabledUntil: Date | null;
	readonly profileFlags: number;

	constructor(guildId: string, guildMember: GuildMember) {
		this.guildId = guildId;
		this.userId = guildMember.user.id;

		const cachedUser = UserStore.getUser(guildMember.user.id);
		if (cachedUser) {
			this.userFallback = cachedUser;
		} else {
			this.userFallback = new UserRecord(guildMember.user);
			UserStore.cacheUsers([this.userFallback.toJSON()]);
		}

		this.nick = guildMember.nick ?? null;
		this.avatar = guildMember.avatar ?? null;
		this.banner = guildMember.banner ?? null;
		this.roles = new Set(guildMember.roles);
		this.joinedAt = new Date(guildMember.joined_at);
		this.joinSourceType = guildMember.join_source_type ?? null;
		this.sourceInviteCode = guildMember.source_invite_code ?? null;
		this.inviterId = guildMember.inviter_id ?? null;
		this.mute = guildMember.mute ?? false;
		this.deaf = guildMember.deaf ?? false;
		this.communicationDisabledUntil = guildMember.communication_disabled_until
			? new Date(guildMember.communication_disabled_until)
			: null;
		this.profileFlags = guildMember.profile_flags ?? 0;
	}

	get user(): UserRecord {
		return UserStore.getUser(this.userId) ?? this.userFallback;
	}

	isAvatarUnset(): boolean {
		return (this.profileFlags & GuildMemberProfileFlags.AVATAR_UNSET) !== 0;
	}

	isBannerUnset(): boolean {
		return (this.profileFlags & GuildMemberProfileFlags.BANNER_UNSET) !== 0;
	}

	withUpdates(updates: Partial<GuildMember>): GuildMemberRecord {
		return new GuildMemberRecord(this.guildId, {
			user: updates.user ?? this.user.toJSON(),
			nick: updates.nick ?? this.nick,
			avatar: updates.avatar ?? this.avatar,
			banner: updates.banner ?? this.banner,
			roles: updates.roles ?? Array.from(this.roles),
			joined_at: updates.joined_at ?? this.joinedAt.toISOString(),
			join_source_type: updates.join_source_type ?? this.joinSourceType,
			source_invite_code: updates.source_invite_code ?? this.sourceInviteCode,
			inviter_id: updates.inviter_id ?? this.inviterId,
			mute: updates.mute ?? this.mute,
			deaf: updates.deaf ?? this.deaf,
			communication_disabled_until:
				updates.communication_disabled_until ?? this.communicationDisabledUntil?.toISOString() ?? null,
			profile_flags: updates.profile_flags ?? this.profileFlags,
		});
	}

	withRoles(roles: Iterable<string>): GuildMemberRecord {
		return new GuildMemberRecord(this.guildId, {
			...this.toJSON(),
			roles: Array.from(roles),
		});
	}

	getSortedRoles(): ReadonlyArray<GuildRoleRecord> {
		const guild = GuildStore.getGuild(this.guildId);
		if (!guild) {
			return [];
		}

		return Array.from(this.roles)
			.map((roleId) => guild.roles[roleId])
			.filter((role): role is GuildRoleRecord => role !== undefined)
			.sort((a, b) => {
				if (b.position !== a.position) {
					return b.position - a.position;
				}
				return BigInt(a.id) < BigInt(b.id) ? -1 : 1;
			});
	}

	getColorString(): string | undefined {
		const sortedRoles = this.getSortedRoles();
		for (const role of sortedRoles) {
			if (role.color) {
				return ColorUtils.int2rgb(role.color);
			}
		}

		const guild = GuildStore.getGuild(this.guildId);
		if (guild) {
			const everyoneRole = guild.roles[this.guildId];
			if (everyoneRole?.color) {
				return ColorUtils.int2rgb(everyoneRole.color);
			}
		}

		return;
	}

	isCurrentUser(): boolean {
		return this.user.id === AuthenticationStore.currentUserId;
	}

	isTimedOut(): boolean {
		if (!this.communicationDisabledUntil) {
			return false;
		}
		return this.communicationDisabledUntil.getTime() > Date.now();
	}

	toJSON(): GuildMember {
		return {
			user: this.user.toJSON(),
			nick: this.nick,
			avatar: this.avatar,
			banner: this.banner,
			roles: Array.from(this.roles),
			joined_at: this.joinedAt.toISOString(),
			join_source_type: this.joinSourceType,
			source_invite_code: this.sourceInviteCode,
			inviter_id: this.inviterId,
			mute: this.mute,
			deaf: this.deaf,
			communication_disabled_until: this.communicationDisabledUntil?.toISOString() ?? null,
			profile_flags: this.profileFlags,
		};
	}
}
