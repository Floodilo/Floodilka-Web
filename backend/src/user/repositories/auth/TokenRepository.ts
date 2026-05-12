/*
 * SPDX-License-Identifier: AGPL-3.0-or-later
 * Copyright (C) 2020-2026 Fluxer Contributors
 * Copyright (C) 2026 Floodilka Contributors
 * Modified by Floodilka Contributors starting March 2026. See LICENSE and NOTICE.
 */

import {
	createEmailRevertToken,
	createEmailVerificationToken,
	createPasswordResetToken,
	type PhoneVerificationToken,
	type UserID,
} from '~/BrandedTypes';
import {deleteOneOrMany, fetchOne, upsertOne} from '~/database/Cassandra';
import type {
	EmailRevertTokenRow,
	EmailVerificationTokenRow,
	PasswordResetTokenRow,
	PhoneTokenRow,
} from '~/database/CassandraTypes';
import {EmailRevertToken, EmailVerificationToken, PasswordResetToken} from '~/Models';
import {EmailRevertTokens, EmailVerificationTokens, PasswordResetTokens, PhoneTokens} from '~/Tables';

const FETCH_EMAIL_VERIFICATION_TOKEN_CQL = EmailVerificationTokens.selectCql({
	where: EmailVerificationTokens.where.eq('token_'),
	limit: 1,
});

const FETCH_PASSWORD_RESET_TOKEN_CQL = PasswordResetTokens.selectCql({
	where: PasswordResetTokens.where.eq('token_'),
	limit: 1,
});

const FETCH_EMAIL_REVERT_TOKEN_CQL = EmailRevertTokens.selectCql({
	where: EmailRevertTokens.where.eq('token_'),
	limit: 1,
});

const FETCH_PHONE_TOKEN_CQL = PhoneTokens.selectCql({
	where: PhoneTokens.where.eq('token_'),
	limit: 1,
});

export class TokenRepository {
	async getEmailVerificationToken(token: string): Promise<EmailVerificationToken | null> {
		const tokenRow = await fetchOne<EmailVerificationTokenRow>(FETCH_EMAIL_VERIFICATION_TOKEN_CQL, {token_: token});
		return tokenRow ? new EmailVerificationToken(tokenRow) : null;
	}

	async createEmailVerificationToken(tokenData: EmailVerificationTokenRow): Promise<EmailVerificationToken> {
		await upsertOne(EmailVerificationTokens.insert(tokenData));
		return new EmailVerificationToken(tokenData);
	}

	async deleteEmailVerificationToken(token: string): Promise<void> {
		await deleteOneOrMany(
			EmailVerificationTokens.deleteCql({
				where: EmailVerificationTokens.where.eq('token_'),
			}),
			{token_: createEmailVerificationToken(token)},
		);
	}

	async getPasswordResetToken(token: string): Promise<PasswordResetToken | null> {
		const tokenRow = await fetchOne<PasswordResetTokenRow>(FETCH_PASSWORD_RESET_TOKEN_CQL, {token_: token});
		return tokenRow ? new PasswordResetToken(tokenRow) : null;
	}

	async createPasswordResetToken(tokenData: PasswordResetTokenRow): Promise<PasswordResetToken> {
		await upsertOne(PasswordResetTokens.insert(tokenData));
		return new PasswordResetToken(tokenData);
	}

	async deletePasswordResetToken(token: string): Promise<void> {
		await deleteOneOrMany(
			PasswordResetTokens.deleteCql({
				where: PasswordResetTokens.where.eq('token_'),
			}),
			{token_: createPasswordResetToken(token)},
		);
	}

	async getEmailRevertToken(token: string): Promise<EmailRevertToken | null> {
		const tokenRow = await fetchOne<EmailRevertTokenRow>(FETCH_EMAIL_REVERT_TOKEN_CQL, {token_: token});
		return tokenRow ? new EmailRevertToken(tokenRow) : null;
	}

	async createEmailRevertToken(tokenData: EmailRevertTokenRow): Promise<EmailRevertToken> {
		await upsertOne(EmailRevertTokens.insert(tokenData));
		return new EmailRevertToken(tokenData);
	}

	async deleteEmailRevertToken(token: string): Promise<void> {
		await deleteOneOrMany(
			EmailRevertTokens.deleteCql({
				where: EmailRevertTokens.where.eq('token_'),
			}),
			{token_: createEmailRevertToken(token)},
		);
	}

	async createPhoneToken(token: PhoneVerificationToken, phone: string, userId: UserID | null): Promise<void> {
		const TTL = 900;
		await upsertOne(
			PhoneTokens.insertWithTtl(
				{
					token_: token,
					phone,
					user_id: userId,
				},
				TTL,
			),
		);
	}

	async getPhoneToken(token: PhoneVerificationToken): Promise<PhoneTokenRow | null> {
		return await fetchOne<PhoneTokenRow>(FETCH_PHONE_TOKEN_CQL, {token_: token});
	}

	async deletePhoneToken(token: PhoneVerificationToken): Promise<void> {
		await deleteOneOrMany(
			PhoneTokens.deleteCql({
				where: PhoneTokens.where.eq('token_'),
			}),
			{token_: token},
		);
	}
}
