/*
 * SPDX-License-Identifier: AGPL-3.0-or-later
 * Copyright (C) 2020-2026 Fluxer Contributors
 * Copyright (C) 2026 Floodilka Contributors
 * Modified by Floodilka Contributors starting March 2026. See LICENSE and NOTICE.
 */

import {SYSTEM_USER_ID} from '~/Constants';
import type {GiftCodeRow} from '~/database/CassandraTypes';
import type {IUserRepository} from '~/user/IUserRepository';
import * as RandomUtils from '~/utils/RandomUtils';

const CODE_LENGTH = 32;

export class AdminCodeGenerationService {
	constructor(private readonly userRepository: IUserRepository) {}

	async generateGiftCodes(count: number, durationMonths: number): Promise<Array<string>> {
		const codes: Array<string> = [];

		for (let i = 0; i < count; i += 1) {
			const code = await this.generateUniqueGiftCode();
			const giftCodeRow: GiftCodeRow = {
				code,
				duration_months: durationMonths,
				created_at: new Date(),
				created_by_user_id: SYSTEM_USER_ID,
				redeemed_at: null,
				redeemed_by_user_id: null,
				cloudpayments_transaction_id: null,
				payment_id: null,
				version: 1,
			};
			await this.userRepository.createGiftCode(giftCodeRow);
			codes.push(code);
		}

		return codes;
	}

	private async generateUniqueGiftCode(): Promise<string> {
		while (true) {
			const candidate = RandomUtils.randomString(CODE_LENGTH);
			const exists = await this.userRepository.findGiftCode(candidate);
			if (!exists) {
				return candidate;
			}
		}
	}
}
