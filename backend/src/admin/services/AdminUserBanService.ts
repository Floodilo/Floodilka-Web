/*
 * SPDX-License-Identifier: AGPL-3.0-or-later
 * Copyright (C) 2020-2026 Fluxer Contributors
 * Copyright (C) 2026 Floodilka Contributors
 * Modified by Floodilka Contributors starting March 2026. See LICENSE and NOTICE.
 */

import type {AuthService} from '~/auth/AuthService';
import {createUserID, type UserID} from '~/BrandedTypes';
import {UserFlags} from '~/Constants';
import {UnknownUserError} from '~/Errors';
import {Logger} from '~/Logger';
import type {IEmailService} from '~/infrastructure/IEmailService';
import type {IUserRepository} from '~/user/IUserRepository';
import type {TempBanUserRequest} from '../AdminModel';
import type {AdminAuditService} from './AdminAuditService';
import type {AdminUserUpdatePropagator} from './AdminUserUpdatePropagator';

interface AdminUserBanServiceDeps {
	userRepository: IUserRepository;
	authService: AuthService;
	emailService: IEmailService;
	auditService: AdminAuditService;
	updatePropagator: AdminUserUpdatePropagator;
}

export class AdminUserBanService {
	constructor(private readonly deps: AdminUserBanServiceDeps) {}

	async tempBanUser(data: TempBanUserRequest, adminUserId: UserID, auditLogReason: string | null) {
		const {userRepository, authService, emailService, auditService, updatePropagator} = this.deps;
		const userId = createUserID(data.user_id);
		const user = await userRepository.findUnique(userId);
		if (!user) {
			throw new UnknownUserError();
		}

		const tempBannedUntil = new Date();
		tempBannedUntil.setHours(tempBannedUntil.getHours() + data.duration_hours);

		const updatedUser = await userRepository.patchUpsert(userId, {
			temp_banned_until: tempBannedUntil,
			flags: user.flags | UserFlags.DISABLED,
		});

		await authService.terminateAllUserSessions(userId);
		await updatePropagator.propagateUserUpdate({userId, oldUser: user, updatedUser: updatedUser!});

		if (user.email) {
			emailService.sendAccountTempBannedEmail(
				user.email,
				user.username,
				data.reason ?? null,
				data.duration_hours,
				tempBannedUntil,
				user.locale,
			).catch((error) => {
				Logger.warn({error, userId: userId.toString()}, 'Failed to send temp ban email');
			});
		}

		await auditService.createAuditLog({
			adminUserId,
			targetType: 'user',
			targetId: BigInt(userId),
			action: 'temp_ban',
			auditLogReason,
			metadata: new Map([
				['duration_hours', data.duration_hours.toString()],
				['reason', data.reason ?? 'null'],
				['banned_until', tempBannedUntil.toISOString()],
			]),
		});
	}

	async unbanUser(data: {user_id: bigint}, adminUserId: UserID, auditLogReason: string | null) {
		const {userRepository, emailService, auditService, updatePropagator} = this.deps;
		const userId = createUserID(data.user_id);
		const user = await userRepository.findUnique(userId);
		if (!user) {
			throw new UnknownUserError();
		}

		const updatedUser = await userRepository.patchUpsert(userId, {
			temp_banned_until: null,
			flags: user.flags & ~UserFlags.DISABLED,
		});
		await updatePropagator.propagateUserUpdate({userId, oldUser: user, updatedUser: updatedUser!});

		if (user.email) {
			emailService.sendUnbanNotification(
				user.email,
				user.username,
				auditLogReason || 'administrative action',
				user.locale,
			).catch((error) => {
				Logger.warn({error, userId: userId.toString()}, 'Failed to send unban notification');
			});
		}

		await auditService.createAuditLog({
			adminUserId,
			targetType: 'user',
			targetId: BigInt(userId),
			action: 'unban',
			auditLogReason,
			metadata: new Map(),
		});
	}
}
