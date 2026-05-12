/*
 * SPDX-License-Identifier: AGPL-3.0-or-later
 * Copyright (C) 2020-2026 Fluxer Contributors
 * Copyright (C) 2026 Floodilka Contributors
 * Modified by Floodilka Contributors starting March 2026. See LICENSE and NOTICE.
 */

import {jwtVerify, SignJWT} from 'jose';
import type {UserID} from '~/BrandedTypes';
import {Config} from '~/Config';

const SUDO_TOKEN_EXPIRY_SECONDS = 5 * 60;

export class SudoModeService {
	private readonly secret: Uint8Array;

	constructor() {
		this.secret = new TextEncoder().encode(Config.auth.sudoModeSecret);
	}

	async generateSudoToken(userId: UserID): Promise<string> {
		const now = Math.floor(Date.now() / 1000);

		const jwt = await new SignJWT({
			type: 'sudo',
		})
			.setProtectedHeader({alg: 'HS256'})
			.setSubject(userId.toString())
			.setIssuedAt(now)
			.setExpirationTime(now + SUDO_TOKEN_EXPIRY_SECONDS)
			.sign(this.secret);

		return jwt;
	}

	async verifySudoToken(token: string, userId: UserID): Promise<boolean> {
		try {
			const {payload} = await jwtVerify(token, this.secret, {
				algorithms: ['HS256'],
			});

			if (payload.type !== 'sudo') {
				return false;
			}

			if (payload.sub !== userId.toString()) {
				return false;
			}

			return true;
		} catch {
			return false;
		}
	}
}

let sudoModeServiceInstance: SudoModeService | null = null;

export function getSudoModeService(): SudoModeService {
	if (!sudoModeServiceInstance) {
		sudoModeServiceInstance = new SudoModeService();
	}
	return sudoModeServiceInstance;
}
