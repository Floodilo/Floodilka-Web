/*
 * SPDX-License-Identifier: AGPL-3.0-or-later
 * Copyright (C) 2020-2026 Fluxer Contributors
 * Copyright (C) 2026 Floodilka Contributors
 * Modified by Floodilka Contributors starting March 2026. See LICENSE and NOTICE.
 */

import crypto from 'node:crypto';
import type {ForgotPasswordRequest, ResetPasswordRequest, VerifyResetCodeRequest} from '~/auth/AuthModel';
import {createPasswordResetToken, createUserID} from '~/BrandedTypes';
import {UserFlags} from '~/Constants';
import {InputValidationError, RateLimitError, UnauthorizedError} from '~/Errors';
import type {ICacheService} from '~/infrastructure/ICacheService';
import type {IEmailService} from '~/infrastructure/IEmailService';
import type {EmailDnsValidationService} from '~/infrastructure/EmailDnsValidationService';
import type {IRateLimitService} from '~/infrastructure/IRateLimitService';
import type {ISMSService} from '~/infrastructure/ISMSService';
import {Logger} from '~/Logger';
import type {AuthSession, User} from '~/Models';
import type {IUserRepository} from '~/user/IUserRepository';
import * as IpUtils from '~/utils/IpUtils';
import {hashPassword as hashPasswordUtil, verifyPassword as verifyPasswordUtil} from '~/utils/PasswordUtils';

interface ForgotPasswordParams {
	data: ForgotPasswordRequest;
	request: Request;
}

interface VerifyResetCodeParams {
	data: VerifyResetCodeRequest;
}

interface ResetPasswordParams {
	data: ResetPasswordRequest;
	request: Request;
}

interface VerifyPasswordParams {
	password: string;
	passwordHash: string;
}

interface PendingResetData {
	userId: string;
	email: string;
	code: string;
	attempts: number;
}

export class AuthPasswordService {
	constructor(
		private repository: IUserRepository,
		private emailService: IEmailService,
		private smsService: ISMSService,
		private emailDnsValidationService: EmailDnsValidationService,
		private rateLimitService: IRateLimitService,
		private cacheService: ICacheService,
		private generateSecureToken: () => Promise<string>,
		private handleBanStatus: (user: User) => Promise<User>,
		private assertNonBotUser: (user: User) => void,
		private createMfaTicketResponse: (
			user: User,
		) => Promise<{mfa: true; ticket: string; sms: boolean; totp: boolean; webauthn: boolean}>,
		private createAuthSession: (params: {user: User; request: Request}) => Promise<[string, AuthSession]>,
	) {}

	async hashPassword(password: string): Promise<string> {
		return hashPasswordUtil(password);
	}

	async verifyPassword({password, passwordHash}: VerifyPasswordParams): Promise<boolean> {
		return verifyPasswordUtil({password, passwordHash});
	}

	async forgotPassword({data, request}: ForgotPasswordParams): Promise<void> {
		const clientIp = IpUtils.requireClientIp(request);

		const identifierKey = data.phone
			? `password_reset:phone:${data.phone}`
			: `password_reset:email:${data.email!.toLowerCase()}`;

		const ipLimitConfig = {maxAttempts: 50, windowMs: 30 * 60 * 1000};
		const identifierLimitConfig = {maxAttempts: 5, windowMs: 30 * 60 * 1000};

		const ipRateLimit = await this.rateLimitService.checkLimit({
			identifier: `password_reset:ip:${clientIp}`,
			...ipLimitConfig,
		});
		const identifierRateLimit = await this.rateLimitService.checkLimit({
			identifier: identifierKey,
			...identifierLimitConfig,
		});

		const exceeded = !ipRateLimit.allowed
			? {result: ipRateLimit, config: ipLimitConfig}
			: !identifierRateLimit.allowed
				? {result: identifierRateLimit, config: identifierLimitConfig}
				: null;

		if (exceeded) {
			const retryAfter =
				exceeded.result.retryAfter ?? Math.max(0, Math.ceil((exceeded.result.resetTime.getTime() - Date.now()) / 1000));
			throw new RateLimitError({
				message: 'Too many password reset attempts. Please try again later.',
				retryAfter,
				limit: exceeded.config.maxAttempts,
				resetTime: exceeded.result.resetTime,
			});
		}

		if (data.phone) {
			const user = await this.repository.findByPhone(data.phone);
			if (!user) {
				return;
			}

			this.assertNonBotUser(user);

			const cacheKey = `pending_reset:phone:${data.phone}`;
			const pendingData: PendingResetData = {
				userId: user.id.toString(),
				email: user.email ?? '',
				code: '',
				attempts: 0,
			};
			await this.cacheService.set(cacheKey, pendingData, 600);

			await this.smsService.startVerification(data.phone);
			return;
		}

		const hasValidDns = await this.emailDnsValidationService.hasValidDnsRecords(data.email!);
		if (!hasValidDns) {
			throw InputValidationError.create('email', 'Недействительный адрес электронной почты');
		}

		const user = await this.repository.findByEmail(data.email!);
		if (!user) {
			return;
		}

		this.assertNonBotUser(user);

		const code = this.generateVerificationCode();
		const cacheKey = `pending_reset:${data.email!.toLowerCase()}`;
		const pendingData: PendingResetData = {
			userId: user.id.toString(),
			email: user.email!,
			code,
			attempts: 0,
		};
		await this.cacheService.set(cacheKey, pendingData, 600);

		this.emailService.sendPasswordResetCode(user.email!, user.username, code, user.locale).catch((error) => {
			Logger.warn({error, userId: user.id.toString()}, 'Failed to send password reset code email');
		});
	}

	async verifyResetCode({data}: VerifyResetCodeParams): Promise<{resetToken: string}> {
		const cacheKey = data.phone ? `pending_reset:phone:${data.phone}` : `pending_reset:${data.email!.toLowerCase()}`;
		const pending = await this.cacheService.get<PendingResetData>(cacheKey);

		if (!pending) {
			throw InputValidationError.create('code', 'Недействительный или просроченный код сброса');
		}

		if (pending.attempts >= 5) {
			await this.cacheService.delete(cacheKey);
			throw InputValidationError.create('code', 'Слишком много попыток. Запросите новый код.');
		}

		const isCodeValid = data.phone
			? await this.smsService.checkVerification(data.phone, data.code)
			: pending.code === data.code;

		if (!isCodeValid) {
			pending.attempts += 1;
			const ttl = await this.cacheService.ttl(cacheKey);
			await this.cacheService.set(cacheKey, pending, ttl > 0 ? ttl : 600);
			throw InputValidationError.create('code', 'Недействительный или просроченный код сброса');
		}

		const token = createPasswordResetToken(await this.generateSecureToken());
		await this.repository.createPasswordResetToken({
			token_: token,
			user_id: createUserID(BigInt(pending.userId)),
			email: pending.email,
		});

		await this.cacheService.delete(cacheKey);

		return {resetToken: token};
	}

	private generateVerificationCode(): string {
		return crypto.randomInt(100000, 999999).toString();
	}

	async resetPassword({
		data,
		request,
	}: ResetPasswordParams): Promise<
		| {mfa: false; user_id: string; token: string}
		| {mfa: true; ticket: string; sms: boolean; totp: boolean; webauthn: boolean}
	> {
		const tokenData = await this.repository.getPasswordResetToken(data.token);
		if (!tokenData) {
			throw InputValidationError.create('token', 'Недействительный или просроченный токен сброса');
		}

		const user = await this.repository.findUnique(tokenData.userId);
		if (!user) {
			throw InputValidationError.create('token', 'Недействительный или просроченный токен сброса');
		}

		this.assertNonBotUser(user);

		if (user.flags & UserFlags.DELETED) {
			throw InputValidationError.create('token', 'Недействительный или просроченный токен сброса');
		}

		await this.handleBanStatus(user);

		const newPasswordHash = await this.hashPassword(data.password);
		const updatedUser = await this.repository.patchUpsert(user.id, {
			password_hash: newPasswordHash,
			password_last_changed_at: new Date(),
		});

		if (!updatedUser) {
			throw new UnauthorizedError();
		}

		await this.repository.deleteAllAuthSessions(user.id);
		await this.repository.deletePasswordResetToken(data.token);

		const hasMfa = (updatedUser.authenticatorTypes?.size ?? 0) > 0;
		if (hasMfa) {
			return await this.createMfaTicketResponse(updatedUser);
		}

		const [token] = await this.createAuthSession({user: updatedUser, request});
		return {mfa: false, user_id: updatedUser.id.toString(), token};
	}
}
