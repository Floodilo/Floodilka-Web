/*
 * SPDX-License-Identifier: AGPL-3.0-or-later
 * Copyright (C) 2020-2026 Fluxer Contributors
 * Copyright (C) 2026 Floodilka Contributors
 * Modified by Floodilka Contributors starting March 2026. See LICENSE and NOTICE.
 */

import type {AuthenticationResponseJSON} from '@simplewebauthn/server';
import type {Context} from 'hono';
import type {HonoEnv} from '~/App';
import type {AuthService} from '~/auth/AuthService';
import type {AuthMfaService} from '~/auth/services/AuthMfaService';
import {getSudoModeService} from '~/auth/services/SudoModeService';
import {InputValidationError} from '~/Errors';
import {SudoModeRequiredError} from '~/errors/SudoModeRequiredError';
import type {User} from '~/Models';
import {SUDO_MODE_HEADER} from '~/middleware/SudoModeMiddleware';
import {setSudoCookie} from '~/utils/SudoCookieUtils';

interface SudoVerificationBody {
	password?: string;
	mfa_method?: 'totp' | 'sms' | 'webauthn';
	mfa_code?: string;
	webauthn_response?: AuthenticationResponseJSON;
	webauthn_challenge?: string;
}

type SudoVerificationMethod = 'password' | 'mfa' | 'sudo_token';

export function userHasMfa(user: {authenticatorTypes?: Set<number> | null}): boolean {
	return (user.authenticatorTypes?.size ?? 0) > 0;
}

export interface SudoVerificationResult {
	verified: boolean;
	method: SudoVerificationMethod;
	sudoToken?: string;
}

export interface SudoVerificationOptions {
	issueSudoToken?: boolean;
}

async function verifySudoMode(
	ctx: Context<HonoEnv>,
	user: User,
	body: SudoVerificationBody,
	authService: AuthService,
	mfaService: AuthMfaService,
	options: SudoVerificationOptions = {},
): Promise<SudoVerificationResult> {
	if (user.isBot) {
		return {verified: true, method: 'sudo_token'};
	}

	const hasMfa = userHasMfa(user);
	const issueSudoToken = options.issueSudoToken ?? hasMfa;

	if (hasMfa && ctx.get('sudoModeValid')) {
		const sudoToken = ctx.get('sudoModeToken') ?? ctx.req.header(SUDO_MODE_HEADER) ?? undefined;
		return {verified: true, method: 'sudo_token', sudoToken: issueSudoToken ? sudoToken : undefined};
	}

	const incomingToken = ctx.req.header(SUDO_MODE_HEADER);
	if (!hasMfa && incomingToken && ctx.get('sudoModeValid')) {
		return {verified: true, method: 'sudo_token', sudoToken: issueSudoToken ? incomingToken : undefined};
	}

	if (hasMfa && body.mfa_method) {
		const result = await mfaService.verifySudoMfa({
			userId: user.id,
			method: body.mfa_method,
			code: body.mfa_code,
			webauthnResponse: body.webauthn_response,
			webauthnChallenge: body.webauthn_challenge,
		});

		if (!result.success) {
			throw InputValidationError.create('mfa_code', result.error ?? 'Неверный код МФА');
		}

		const sudoModeService = getSudoModeService();
		const sudoToken = issueSudoToken ? await sudoModeService.generateSudoToken(user.id) : undefined;

		return {verified: true, sudoToken, method: 'mfa'};
	}

	const isUnclaimedAccount = user.isUnclaimedAccount();
	if (isUnclaimedAccount && !hasMfa) {
		return {verified: true, method: 'password'};
	}

	if (body.password && !hasMfa) {
		if (!user.passwordHash) {
			throw InputValidationError.create('password', 'Пароль не установлен');
		}

		const passwordValid = await authService.verifyPassword({
			password: body.password,
			passwordHash: user.passwordHash,
		});

		if (!passwordValid) {
			throw InputValidationError.create('password', 'Неверный пароль');
		}

		return {verified: true, method: 'password'};
	}

	throw new SudoModeRequiredError(hasMfa);
}

function setSudoTokenHeader(
	ctx: Context<HonoEnv>,
	result: SudoVerificationResult,
	options: SudoVerificationOptions = {},
): void {
	const issueSudoToken = options.issueSudoToken ?? true;

	if (!issueSudoToken) {
		return;
	}

	const tokenToSet = result.sudoToken ?? ctx.req.header(SUDO_MODE_HEADER);
	if (tokenToSet) {
		ctx.header(SUDO_MODE_HEADER, tokenToSet);
		const user = ctx.get('user');
		if (user) {
			setSudoCookie(ctx, tokenToSet, user.id.toString());
		}
	}
}

export async function requireSudoMode(
	ctx: Context<HonoEnv>,
	user: User,
	body: SudoVerificationBody,
	authService: AuthService,
	mfaService: AuthMfaService,
	options: SudoVerificationOptions = {},
): Promise<SudoVerificationResult> {
	const sudoResult = await verifySudoMode(ctx, user, body, authService, mfaService, options);
	setSudoTokenHeader(ctx, sudoResult, options);
	return sudoResult;
}
