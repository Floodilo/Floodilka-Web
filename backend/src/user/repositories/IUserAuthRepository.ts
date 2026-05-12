/*
 * SPDX-License-Identifier: AGPL-3.0-or-later
 * Copyright (C) 2020-2026 Fluxer Contributors
 * Copyright (C) 2026 Floodilka Contributors
 * Modified by Floodilka Contributors starting March 2026. See LICENSE and NOTICE.
 */

import type {PhoneVerificationToken, UserID} from '~/BrandedTypes';
import type {
	AuthSessionRow,
	EmailRevertTokenRow,
	EmailVerificationTokenRow,
	PasswordResetTokenRow,
	PhoneTokenRow,
} from '~/database/CassandraTypes';
import type {
	AuthSession,
	EmailRevertToken,
	EmailVerificationToken,
	MfaBackupCode,
	PasswordResetToken,
	WebAuthnCredential,
} from '~/Models';

export interface IUserAuthRepository {
	listAuthSessions(userId: UserID): Promise<Array<AuthSession>>;
	getAuthSessionByToken(sessionIdHash: Buffer): Promise<AuthSession | null>;
	createAuthSession(sessionData: AuthSessionRow): Promise<AuthSession>;
	updateAuthSessionLastUsed(sessionIdHash: Buffer): Promise<void>;
	deleteAuthSessions(userId: UserID, sessionIdHashes: Array<Buffer>): Promise<void>;
	revokeAuthSession(sessionIdHash: Buffer): Promise<void>;
	deleteAllAuthSessions(userId: UserID): Promise<void>;

	listMfaBackupCodes(userId: UserID): Promise<Array<MfaBackupCode>>;
	createMfaBackupCodes(userId: UserID, codes: Array<string>): Promise<Array<MfaBackupCode>>;
	clearMfaBackupCodes(userId: UserID): Promise<void>;
	consumeMfaBackupCode(userId: UserID, code: string): Promise<void>;
	deleteAllMfaBackupCodes(userId: UserID): Promise<void>;

	getEmailVerificationToken(token: string): Promise<EmailVerificationToken | null>;
	createEmailVerificationToken(tokenData: EmailVerificationTokenRow): Promise<EmailVerificationToken>;
	deleteEmailVerificationToken(token: string): Promise<void>;

	getPasswordResetToken(token: string): Promise<PasswordResetToken | null>;
	createPasswordResetToken(tokenData: PasswordResetTokenRow): Promise<PasswordResetToken>;
	deletePasswordResetToken(token: string): Promise<void>;

	getEmailRevertToken(token: string): Promise<EmailRevertToken | null>;
	createEmailRevertToken(tokenData: EmailRevertTokenRow): Promise<EmailRevertToken>;
	deleteEmailRevertToken(token: string): Promise<void>;

	createPhoneToken(token: PhoneVerificationToken, phone: string, userId: UserID | null): Promise<void>;
	getPhoneToken(token: PhoneVerificationToken): Promise<PhoneTokenRow | null>;
	deletePhoneToken(token: PhoneVerificationToken): Promise<void>;
	updateUserActivity(userId: UserID, clientIp: string): Promise<void>;

	listWebAuthnCredentials(userId: UserID): Promise<Array<WebAuthnCredential>>;
	getWebAuthnCredential(userId: UserID, credentialId: string): Promise<WebAuthnCredential | null>;
	createWebAuthnCredential(
		userId: UserID,
		credentialId: string,
		publicKey: Buffer,
		counter: bigint,
		transports: Set<string> | null,
		name: string,
	): Promise<void>;
	updateWebAuthnCredentialCounter(userId: UserID, credentialId: string, counter: bigint): Promise<void>;
	updateWebAuthnCredentialLastUsed(userId: UserID, credentialId: string): Promise<void>;
	updateWebAuthnCredentialName(userId: UserID, credentialId: string, name: string): Promise<void>;
	deleteWebAuthnCredential(userId: UserID, credentialId: string): Promise<void>;
	getUserIdByCredentialId(credentialId: string): Promise<UserID | null>;
	deleteAllWebAuthnCredentials(userId: UserID): Promise<void>;
}
