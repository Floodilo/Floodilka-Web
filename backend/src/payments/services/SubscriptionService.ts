/*
 * SPDX-License-Identifier: AGPL-3.0-or-later
 * Copyright (C) 2020-2026 Fluxer Contributors
 * Copyright (C) 2026 Floodilka Contributors
 * Modified by Floodilka Contributors starting March 2026. See LICENSE and NOTICE.
 */

import type {UserID} from '~/BrandedTypes';
import {PaymentError, UnknownUserError} from '~/Errors';
import type {IGatewayService} from '~/infrastructure/IGatewayService';
import {Logger} from '~/Logger';
import type {User} from '~/Models';
import type {IUserRepository} from '~/user/IUserRepository';
import {mapUserToPrivateResponse} from '~/user/UserModel';
import type {CloudPaymentsClient} from '../CloudPaymentsClient';

export class SubscriptionService {
	constructor(
		private client: CloudPaymentsClient,
		private userRepository: IUserRepository,
		private gatewayService: IGatewayService,
	) {}

	async createSubscription(
		userId: UserID,
		token: string,
		billingCycle: 'monthly' | 'yearly',
	): Promise<string> {
		const user = await this.userRepository.findUnique(userId);
		if (!user) {
			throw new UnknownUserError();
		}

		const interval: 'Month' = 'Month';
		const period = billingCycle === 'yearly' ? 12 : 1;

		const {getProductForSubscription} = await import('../ProductRegistry');
		const product = getProductForSubscription(billingCycle);
		const amount = product.amountRub;

		const startDate = new Date();
		startDate.setMonth(startDate.getMonth() + (billingCycle === 'yearly' ? 12 : 1));

		const result = await this.client.createSubscription({
			Token: token,
			AccountId: userId.toString(),
			Description: `Floodilka Premium — ${billingCycle === 'yearly' ? 'Годовая' : 'Месячная'} подписка`,
			Amount: amount,
			Currency: 'RUB',
			RequireConfirmation: false,
			Interval: interval,
			Period: period,
			StartDate: startDate.toISOString(),
		});

		if (!result.Success || !result.Model) {
			Logger.error({userId, message: result.Message}, 'Failed to create CloudPayments subscription');
			throw new PaymentError(result.Message || 'Failed to create subscription');
		}

		const subscriptionId = result.Model.Id;

		await this.userRepository.patchUpsert(userId, {
			cloudpayments_subscription_id: subscriptionId,
			premium_billing_cycle: billingCycle,
		});

		Logger.debug({userId, subscriptionId, billingCycle}, 'CloudPayments subscription created');

		return subscriptionId;
	}

	async cancelSubscriptionAtPeriodEnd(userId: UserID): Promise<void> {
		const user = await this.userRepository.findUnique(userId);
		if (!user) {
			throw new UnknownUserError();
		}

		if (!user.cloudpaymentsSubscriptionId) {
			throw new PaymentError('Активная подписка не найдена');
		}

		if (user.premiumWillCancel) {
			throw new PaymentError('Подписка уже настроена на отмену в конце периода');
		}

		try {
			await this.client.cancelSubscription(user.cloudpaymentsSubscriptionId);

			const updatedUser = await this.userRepository.patchUpsert(userId, {
				premium_will_cancel: true,
				cloudpayments_subscription_id: null,
			});

			if (updatedUser) {
				await this.dispatchUser(updatedUser);
			}

			Logger.debug(
				{userId, subscriptionId: user.cloudpaymentsSubscriptionId},
				'Subscription cancelled, premium active until period end',
			);
		} catch (error: unknown) {
			Logger.error(
				{error, userId, subscriptionId: user.cloudpaymentsSubscriptionId},
				'Failed to cancel subscription',
			);
			const message = error instanceof Error ? error.message : 'Failed to cancel subscription';
			throw new PaymentError(message);
		}
	}

	async reactivateSubscription(userId: UserID): Promise<void> {
		const user = await this.userRepository.findUnique(userId);
		if (!user) {
			throw new UnknownUserError();
		}

		if (!user.premiumWillCancel) {
			throw new PaymentError('Подписка не настроена на отмену');
		}

		if (!user.cloudpaymentsToken) {
			throw new PaymentError('Сохранённый способ оплаты не найден. Оформите подписку заново.');
		}

		if (!user.premiumBillingCycle) {
			throw new PaymentError('Платёжный цикл не найден');
		}

		try {
			const subscriptionId = await this.createSubscription(
				userId,
				user.cloudpaymentsToken,
				user.premiumBillingCycle as 'monthly' | 'yearly',
			);

			const updatedUser = await this.userRepository.patchUpsert(userId, {
				premium_will_cancel: false,
				cloudpayments_subscription_id: subscriptionId,
			});

			if (updatedUser) {
				await this.dispatchUser(updatedUser);
			}

			Logger.debug({userId, subscriptionId}, 'Subscription reactivated');
		} catch (error: unknown) {
			Logger.error({error, userId}, 'Failed to reactivate subscription');
			const message = error instanceof Error ? error.message : 'Failed to reactivate subscription';
			throw new PaymentError(message);
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
