/*
 * SPDX-License-Identifier: AGPL-3.0-or-later
 * Copyright (C) 2020-2026 Fluxer Contributors
 * Copyright (C) 2026 Floodilka Contributors
 * Modified by Floodilka Contributors starting March 2026. See LICENSE and NOTICE.
 */

import type {UserID} from '~/BrandedTypes';
import {UserPremiumTypes} from '~/Constants';
import type {IGatewayService} from '~/infrastructure/IGatewayService';
import {Logger} from '~/Logger';
import type {User} from '~/Models';
import type {IUserRepository} from '~/user/IUserRepository';
import {mapUserToPrivateResponse} from '~/user/UserModel';
import {addMonthsClamp} from '../PaymentUtils';

export class PremiumService {
	constructor(
		private userRepository: IUserRepository,
		private gatewayService: IGatewayService,
	) {}

	async grantPremium(
		userId: UserID,
		durationMonths: number,
		billingCycle: string | null = null,
		hasEverPurchased: boolean = false,
	): Promise<void> {
		const user = await this.userRepository.findUnique(userId);
		if (!user) {
			return;
		}

		const now = new Date();
		let premiumUntil: Date | null = null;

		if (durationMonths > 0) {
			const currentPremiumUntil = user.premiumUntil && user.premiumUntil > now ? user.premiumUntil : now;
			premiumUntil = addMonthsClamp(currentPremiumUntil, durationMonths);
		}

		const updatedUser = await this.userRepository.patchUpsert(userId, {
			premium_type: UserPremiumTypes.SUBSCRIPTION,
			premium_since: user.premiumSince || now,
			premium_until: premiumUntil,
			has_ever_purchased: hasEverPurchased,
			premium_will_cancel: false,
			premium_billing_cycle: billingCycle,
		});

		if (updatedUser) {
			await this.dispatchUser(updatedUser);
		}

		Logger.debug({userId, durationMonths, billingCycle}, 'Premium granted to user');
	}

	async grantPremiumFromGift(userId: UserID, durationMonths: number): Promise<void> {
		const user = await this.userRepository.findUnique(userId);
		if (!user) {
			return;
		}

		const now = new Date();
		let premiumUntil: Date | null = null;

		if (durationMonths > 0) {
			const currentPremiumUntil = user.premiumUntil && user.premiumUntil > now ? user.premiumUntil : now;
			premiumUntil = addMonthsClamp(currentPremiumUntil, durationMonths);
		}

		const updatedUser = await this.userRepository.patchUpsert(userId, {
			premium_type: UserPremiumTypes.SUBSCRIPTION,
			premium_since: user.premiumSince || now,
			premium_until: premiumUntil,
			premium_will_cancel: false,
		});

		if (updatedUser) {
			await this.dispatchUser(updatedUser);
		}

		Logger.debug({userId, durationMonths}, 'Premium granted to user from gift');
	}

	async revokePremium(userId: UserID): Promise<void> {
		const updatedUser = await this.userRepository.patchUpsert(userId, {
			premium_type: UserPremiumTypes.NONE,
			premium_until: null,
		});

		if (updatedUser) {
			await this.dispatchUser(updatedUser);
		}
	}

	private async dispatchUser(user: User): Promise<void> {
		await this.gatewayService.dispatchPresence({
			userId: user.id,
			event: 'USER_UPDATE',
			data: mapUserToPrivateResponse(user),
		});
	}
}
