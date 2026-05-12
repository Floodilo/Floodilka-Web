/*
 * SPDX-License-Identifier: AGPL-3.0-or-later
 * Copyright (C) 2020-2026 Fluxer Contributors
 * Copyright (C) 2026 Floodilka Contributors
 * Modified by Floodilka Contributors starting March 2026. See LICENSE and NOTICE.
 */

import type {VerifyEmailRequest} from '~/auth/AuthModel';
import {createEmailVerificationToken} from '~/BrandedTypes';
import {SuspiciousActivityFlags, UserFlags} from '~/Constants';
import {RateLimitError} from '~/Errors';
import type {IEmailService} from '~/infrastructure/IEmailService';
import type {IGatewayService} from '~/infrastructure/IGatewayService';
import type {IRateLimitService} from '~/infrastructure/IRateLimitService';
import {Logger} from '~/Logger';
import {getUserSearchService} from '~/Meilisearch';
import type {User} from '~/Models';
import type {IUserRepository} from '~/user/IUserRepository';
import {mapUserToPrivateResponse} from '~/user/UserModel';

const EMAIL_CLEARABLE_SUSPICIOUS_ACTIVITY_FLAGS =
	SuspiciousActivityFlags.REQUIRE_VERIFIED_EMAIL |
	SuspiciousActivityFlags.REQUIRE_REVERIFIED_EMAIL |
	SuspiciousActivityFlags.REQUIRE_VERIFIED_EMAIL_OR_VERIFIED_PHONE |
	SuspiciousActivityFlags.REQUIRE_REVERIFIED_EMAIL_OR_VERIFIED_PHONE |
	SuspiciousActivityFlags.REQUIRE_VERIFIED_EMAIL_OR_REVERIFIED_PHONE |
	SuspiciousActivityFlags.REQUIRE_REVERIFIED_EMAIL_OR_REVERIFIED_PHONE;

export class AuthEmailService {
	constructor(
		private repository: IUserRepository,
		private emailService: IEmailService,
		private gatewayService: IGatewayService,
		private rateLimitService: IRateLimitService,
		private assertNonBotUser: (user: User) => void,
		private generateSecureToken: () => Promise<string>,
	) {}

	async verifyEmail(data: VerifyEmailRequest): Promise<boolean> {
		const tokenData = await this.repository.getEmailVerificationToken(data.token);
		if (!tokenData) {
			return false;
		}

		const user = await this.repository.findUnique(tokenData.userId);
		if (!user) {
			return false;
		}

		this.assertNonBotUser(user);

		if (user.flags & UserFlags.DELETED) {
			return false;
		}

		const updates: {email_verified: boolean; suspicious_activity_flags?: number} = {
			email_verified: true,
		};

		if (user.suspiciousActivityFlags !== null && user.suspiciousActivityFlags !== 0) {
			const newFlags = user.suspiciousActivityFlags & ~EMAIL_CLEARABLE_SUSPICIOUS_ACTIVITY_FLAGS;
			if (newFlags !== user.suspiciousActivityFlags) {
				updates.suspicious_activity_flags = newFlags;
			}
		}

		const updatedUser = await this.repository.patchUpsert(user.id, updates);
		await this.repository.deleteEmailVerificationToken(data.token);

		const userSearchService = getUserSearchService();
		if (userSearchService && updatedUser) {
			await userSearchService.updateUser(updatedUser).catch((error) => {
				Logger.error({userId: user.id, error}, 'Failed to update user in search');
			});
		}

		await this.gatewayService.dispatchPresence({
			userId: user.id,
			event: 'USER_UPDATE',
			data: mapUserToPrivateResponse(updatedUser!),
		});

		return true;
	}

	async resendVerificationEmail(user: User): Promise<void> {
		this.assertNonBotUser(user);

		const allowReverification =
			user.suspiciousActivityFlags !== null &&
			((user.suspiciousActivityFlags & SuspiciousActivityFlags.REQUIRE_REVERIFIED_EMAIL) !== 0 ||
				(user.suspiciousActivityFlags & SuspiciousActivityFlags.REQUIRE_REVERIFIED_EMAIL_OR_VERIFIED_PHONE) !== 0 ||
				(user.suspiciousActivityFlags & SuspiciousActivityFlags.REQUIRE_VERIFIED_EMAIL_OR_REVERIFIED_PHONE) !== 0 ||
				(user.suspiciousActivityFlags & SuspiciousActivityFlags.REQUIRE_REVERIFIED_EMAIL_OR_REVERIFIED_PHONE) !== 0);

		if (user.emailVerified && !allowReverification) {
			return;
		}

		const rateLimit = await this.rateLimitService.checkLimit({
			identifier: `email_verification:${user.email!}`,
			maxAttempts: 3,
			windowMs: 15 * 60 * 1000,
		});

		if (!rateLimit.allowed) {
			const resetTime = new Date(Date.now() + (rateLimit.retryAfter || 0) * 1000);
			throw new RateLimitError({
				message: 'Too many verification email requests. Please try again later.',
				retryAfter: rateLimit.retryAfter || 0,
				limit: 3,
				resetTime,
			});
		}

		const emailVerifyToken = createEmailVerificationToken(await this.generateSecureToken());
		await this.repository.createEmailVerificationToken({
			token_: emailVerifyToken,
			user_id: user.id,
			email: user.email!,
		});

		this.emailService.sendEmailVerification(user.email!, user.username, emailVerifyToken, user.locale).catch((error) => {
			Logger.warn({error, userId: user.id.toString()}, 'Failed to send email verification');
		});
	}
}
