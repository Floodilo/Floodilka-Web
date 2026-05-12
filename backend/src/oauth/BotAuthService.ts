/*
 * SPDX-License-Identifier: AGPL-3.0-or-later
 * Copyright (C) 2020-2026 Fluxer Contributors
 * Copyright (C) 2026 Floodilka Contributors
 * Modified by Floodilka Contributors starting March 2026. See LICENSE and NOTICE.
 */

import {randomBytes} from 'node:crypto';
import argon2 from 'argon2';
import type {ApplicationID, UserID} from '~/BrandedTypes';
import type {IApplicationRepository} from './repositories/IApplicationRepository';

export class BotAuthService {
	constructor(private readonly applicationRepository: IApplicationRepository) {}

	private parseBotToken(token: string): {applicationId: ApplicationID; secret: string} | null {
		const parts = token.split('.');
		if (parts.length !== 2) {
			return null;
		}

		const [applicationIdStr, secret] = parts;
		if (!applicationIdStr || !secret) {
			return null;
		}

		try {
			const applicationId = BigInt(applicationIdStr) as ApplicationID;
			return {applicationId, secret};
		} catch {
			return null;
		}
	}

	async validateBotToken(token: string): Promise<UserID | null> {
		const parsed = this.parseBotToken(token);
		if (!parsed) {
			return null;
		}

		const {applicationId, secret} = parsed;
		const application = await this.applicationRepository.getApplication(applicationId);

		if (!application || !application.hasBotUser() || !application.botTokenHash) {
			return null;
		}

		try {
			const isValid = await argon2.verify(application.botTokenHash, secret);
			return isValid ? application.getBotUserId() : null;
		} catch {
			return null;
		}
	}

	async generateBotToken(applicationId: ApplicationID): Promise<{
		token: string;
		hash: string;
		preview: string;
	}> {
		const secret = randomBytes(32).toString('base64url');
		const hash = await argon2.hash(secret);
		const preview = secret.slice(0, 8);
		const token = `${applicationId.toString()}.${secret}`;

		return {token, hash, preview};
	}
}
