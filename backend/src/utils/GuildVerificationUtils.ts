/*
 * SPDX-License-Identifier: AGPL-3.0-or-later
 * Copyright (C) 2020-2026 Fluxer Contributors
 * Copyright (C) 2026 Floodilka Contributors
 * Modified by Floodilka Contributors starting March 2026. See LICENSE and NOTICE.
 */

import {createRoleIDSet, createUserID, type RoleID, type UserID} from '~/BrandedTypes';
import {GuildVerificationLevel} from '~/Constants';
import {GuildVerificationRequiredError} from '~/Errors';
import type {GuildMemberResponse, GuildResponse} from '~/guild/GuildModel';
import type {Guild, GuildMember, User} from '~/Models';
import {extractTimestamp} from '~/utils/SnowflakeUtils';

interface VerificationParams {
	user: User;
	ownerId: UserID;
	verificationLevel: number;
	memberJoinedAt?: Date | string | null;
	memberRoles?: Set<RoleID>;
}

function checkGuildVerification(params: VerificationParams): void {
	const {user, ownerId, verificationLevel, memberJoinedAt, memberRoles} = params;

	if (user.id === ownerId) {
		return;
	}

	if (verificationLevel === GuildVerificationLevel.NONE) {
		return;
	}

	if (user.isBot) {
		return;
	}

	if (memberRoles && memberRoles.size > 0) {
		return;
	}

	if (!user.email) {
		throw new GuildVerificationRequiredError('Подтвердите аккаунт, чтобы отправлять сообщения на этом сервере.');
	}

	if (verificationLevel >= GuildVerificationLevel.LOW) {
		if (!user.emailVerified) {
			throw new GuildVerificationRequiredError('Подтвердите email, чтобы отправлять сообщения на этом сервере.');
		}
	}

	if (verificationLevel >= GuildVerificationLevel.MEDIUM) {
		const createdAt = extractTimestamp(BigInt(user.id));
		const accountAge = Date.now() - createdAt;
		const FIVE_MINUTES_MS = 5 * 60 * 1000;
		if (accountAge < FIVE_MINUTES_MS) {
			throw new GuildVerificationRequiredError('Ваш аккаунт слишком новый для отправки сообщений на этом сервере.');
		}
	}

	if (verificationLevel >= GuildVerificationLevel.HIGH) {
		if (memberJoinedAt) {
			const joinedAtTime =
				typeof memberJoinedAt === 'string' ? new Date(memberJoinedAt).getTime() : memberJoinedAt.getTime();
			const membershipDuration = Date.now() - joinedAtTime;
			const TEN_MINUTES_MS = 10 * 60 * 1000;
			if (membershipDuration < TEN_MINUTES_MS) {
				throw new GuildVerificationRequiredError(
					'Вы состоите на этом сервере недостаточно долго для отправки сообщений.',
				);
			}
		}
	}

	if (verificationLevel >= GuildVerificationLevel.VERY_HIGH) {
		if (!user.phone) {
			throw new GuildVerificationRequiredError('Добавьте номер телефона, чтобы отправлять сообщения на этом сервере.');
		}
	}
}

export function checkGuildVerificationWithGuildModel({
	user,
	guild,
	member,
}: {
	user: User;
	guild: Guild;
	member: GuildMember;
}): void {
	checkGuildVerification({
		user,
		ownerId: guild.ownerId,
		verificationLevel: guild.verificationLevel ?? GuildVerificationLevel.NONE,
		memberJoinedAt: member.joinedAt,
		memberRoles: member.roleIds,
	});
}

export function checkGuildVerificationWithResponse({
	user,
	guild,
	member,
}: {
	user: User;
	guild: GuildResponse;
	member: GuildMemberResponse;
}): void {
	const ownerIdSource = guild.owner_id ?? user.id;
	const ownerIdBigInt = typeof ownerIdSource === 'bigint' ? ownerIdSource : BigInt(ownerIdSource);

	checkGuildVerification({
		user,
		ownerId: createUserID(ownerIdBigInt),
		verificationLevel: guild.verification_level ?? GuildVerificationLevel.NONE,
		memberJoinedAt: member.joined_at,
		memberRoles: createRoleIDSet(new Set(member.roles.map((roleId) => BigInt(roleId)))),
	});
}
