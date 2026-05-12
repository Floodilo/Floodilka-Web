/*
 * SPDX-License-Identifier: AGPL-3.0-or-later
 * Copyright (C) 2020-2026 Fluxer Contributors
 * Copyright (C) 2026 Floodilka Contributors
 * Modified by Floodilka Contributors starting March 2026. See LICENSE and NOTICE.
 */

import {Endpoints} from '~/Endpoints';
import http from '~/lib/HttpClient';
import {Logger} from '~/lib/Logger';

const logger = new Logger('Premium');

export interface Prices {
	monthly: number;
	yearly: number;
	gift1Month: number;
	gift1Year: number;
	currency: 'RUB';
	publicId: string;
}

export const fetchPrices = async (): Promise<Prices> => {
	try {
		const response = await http.get<Prices>(Endpoints.PREMIUM_PRICES);
		logger.debug('Prices fetched', response.body);
		return response.body;
	} catch (error) {
		logger.error('Prices fetch failed', error);
		throw error;
	}
};

export const cancelSubscriptionAtPeriodEnd = async (): Promise<void> => {
	try {
		await http.post({url: Endpoints.PREMIUM_CANCEL_SUBSCRIPTION});
		logger.info('Subscription set to cancel at period end');
	} catch (error) {
		logger.error('Failed to cancel subscription at period end', error);
		throw error;
	}
};

export const reactivateSubscription = async (): Promise<void> => {
	try {
		await http.post({url: Endpoints.PREMIUM_REACTIVATE_SUBSCRIPTION});
		logger.info('Subscription reactivated');
	} catch (error) {
		logger.error('Failed to reactivate subscription', error);
		throw error;
	}
};

export const rejoinOperatorGuild = async (): Promise<void> => {
	try {
		await http.post({url: Endpoints.PREMIUM_OPERATOR_REJOIN});
		logger.info('Operator guild rejoin requested');
	} catch (error) {
		logger.error('Failed to rejoin Operator guild', error);
		throw error;
	}
};
