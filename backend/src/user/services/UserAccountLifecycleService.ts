/*
 * SPDX-License-Identifier: AGPL-3.0-or-later
 * Copyright (C) 2020-2026 Fluxer Contributors
 * Copyright (C) 2026 Floodilka Contributors
 * Modified by Floodilka Contributors starting March 2026. See LICENSE and NOTICE.
 */

import type {AuthService} from '~/auth/AuthService';
import type {UserID} from '~/BrandedTypes';
import {Config} from '~/Config';
import {DeletionReasons, UserFlags} from '~/Constants';
import {UnknownUserError, UserOwnsGuildsError} from '~/Errors';
import {Logger} from '~/Logger';
import type {IGuildRepository} from '~/guild/IGuildRepository';
import type {IEmailService} from '~/infrastructure/IEmailService';
import type {RedisAccountDeletionQueueService} from '~/infrastructure/RedisAccountDeletionQueueService';
import {hasPartialUserFieldsChanged} from '~/user/UserMappers';
import type {IUserAccountRepository} from '../repositories/IUserAccountRepository';
import type {UserAccountUpdatePropagator} from './UserAccountUpdatePropagator';

interface UserAccountLifecycleServiceDeps {
	userAccountRepository: IUserAccountRepository;
	guildRepository: IGuildRepository;
	authService: AuthService;
	emailService: IEmailService;
	updatePropagator: UserAccountUpdatePropagator;
	redisDeletionQueue: RedisAccountDeletionQueueService;
}

export class UserAccountLifecycleService {
	constructor(private readonly deps: UserAccountLifecycleServiceDeps) {}

	async selfDisable(userId: UserID): Promise<void> {
		const user = await this.deps.userAccountRepository.findUnique(userId);
		if (!user) {
			throw new UnknownUserError();
		}

		const ownedGuildIds = await this.deps.guildRepository.listOwnedGuildIds(userId);
		if (ownedGuildIds.length > 0) {
			throw new UserOwnsGuildsError();
		}

		const updatedUser = await this.deps.userAccountRepository.patchUpsert(userId, {
			flags: user.flags | UserFlags.DISABLED,
		});

		await this.deps.authService.terminateAllUserSessions(userId);

		await this.deps.updatePropagator.dispatchUserUpdate(updatedUser!);
		if (hasPartialUserFieldsChanged(user, updatedUser!)) {
			await this.deps.updatePropagator.invalidateUserCache(userId);
		}
	}

	async selfDelete(userId: UserID): Promise<void> {
		const user = await this.deps.userAccountRepository.findUnique(userId);
		if (!user) {
			throw new UnknownUserError();
		}

		const ownedGuildIds = await this.deps.guildRepository.listOwnedGuildIds(userId);
		if (ownedGuildIds.length > 0) {
			throw new UserOwnsGuildsError();
		}

		const gracePeriodMs = Config.deletionGracePeriodHours * 60 * 60 * 1000;
		const pendingDeletionAt = new Date(Date.now() + gracePeriodMs);

		const updatedUser = await this.deps.userAccountRepository.patchUpsert(userId, {
			flags: user.flags | UserFlags.SELF_DELETED,
			pending_deletion_at: pendingDeletionAt,
		});

		await this.deps.userAccountRepository.addPendingDeletion(userId, pendingDeletionAt, DeletionReasons.USER_REQUESTED);

		await this.deps.redisDeletionQueue.scheduleDeletion(userId, pendingDeletionAt, DeletionReasons.USER_REQUESTED);

		if (user.email) {
			this.deps.emailService.sendSelfDeletionScheduledEmail(
				user.email,
				user.username,
				pendingDeletionAt,
				user.locale,
			).catch((error) => {
				Logger.warn({error, userId: userId.toString()}, 'Failed to send self deletion email');
			});
		}

		await this.deps.authService.terminateAllUserSessions(userId);

		await this.deps.updatePropagator.dispatchUserUpdate(updatedUser!);
		if (hasPartialUserFieldsChanged(user, updatedUser!)) {
			await this.deps.updatePropagator.invalidateUserCache(userId);
		}
	}
}
