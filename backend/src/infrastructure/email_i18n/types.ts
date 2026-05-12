/*
 * SPDX-License-Identifier: AGPL-3.0-or-later
 * Copyright (C) 2020-2026 Fluxer Contributors
 * Copyright (C) 2026 Floodilka Contributors
 * Modified by Floodilka Contributors starting March 2026. See LICENSE and NOTICE.
 */

export type EmailTemplateKey =
	| 'passwordReset'
	| 'passwordResetCode'
	| 'emailVerification'
	| 'emailChangeOriginal'
	| 'emailChangeNew'
	| 'emailChangeRevert'
	| 'accountDisabledSuspicious'
	| 'accountTempBanned'
	| 'accountScheduledDeletion'
	| 'selfDeletionScheduled'
	| 'inactivityWarning'
	| 'harvestCompleted'
	| 'unbanNotification'
	| 'scheduledDeletionNotification'
	| 'giftChargebackNotification'
	| 'reportResolved'
	| 'dsaReportVerification'
	| 'registrationCode';

export interface EmailTemplateVariables {
	passwordReset: {
		username: string;
		resetUrl: string;
	};
	passwordResetCode: {
		username: string;
		code: string;
	};
	emailVerification: {
		username: string;
		verifyUrl: string;
	};
	emailChangeOriginal: {
		username: string;
		code: string;
		expiresAt: Date;
	};
	emailChangeNew: {
		username: string;
		code: string;
		expiresAt: Date;
	};
	emailChangeRevert: {
		username: string;
		newEmail: string;
		revertUrl: string;
	};
	accountDisabledSuspicious: {
		username: string;
		reason: string | null;
		forgotUrl: string;
	};
	accountTempBanned: {
		username: string;
		reason: string | null;
		durationHours: number;
		bannedUntil: Date;
		termsUrl: string;
		guidelinesUrl: string;
	};
	accountScheduledDeletion: {
		username: string;
		reason: string | null;
		deletionDate: Date;
		termsUrl: string;
		guidelinesUrl: string;
	};
	selfDeletionScheduled: {
		username: string;
		deletionDate: Date;
	};
	inactivityWarning: {
		username: string;
		deletionDate: Date;
		lastActiveDate: Date;
		loginUrl: string;
	};
	harvestCompleted: {
		username: string;
		downloadUrl: string;
		totalMessages: number;
		fileSizeMB: number;
		expiresAt: Date;
	};
	unbanNotification: {
		username: string;
		reason: string;
	};
	scheduledDeletionNotification: {
		username: string;
		deletionDate: Date;
		reason: string;
	};
	giftChargebackNotification: {
		username: string;
	};
	reportResolved: {
		username: string;
		reportId: string;
		publicComment: string;
	};
	dsaReportVerification: {
		code: string;
		expiresAt: Date;
	};
	registrationCode: {
		username: string;
		code: string;
	};
}

export interface EmailTemplate {
	subject: string;
	body: string;
}

export type EmailTranslations = Partial<Record<EmailTemplateKey, EmailTemplate>>;
