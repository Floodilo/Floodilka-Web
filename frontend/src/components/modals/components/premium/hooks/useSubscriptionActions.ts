/*
 * SPDX-License-Identifier: AGPL-3.0-or-later
 * Copyright (C) 2020-2026 Fluxer Contributors
 * Copyright (C) 2026 Floodilka Contributors
 * Modified by Floodilka Contributors starting March 2026. See LICENSE and NOTICE.
 */

import {useLingui} from '@lingui/react/macro';
import React from 'react';
import * as PremiumActionCreators from '~/actions/PremiumActionCreators';
import * as ToastActionCreators from '~/actions/ToastActionCreators';
import {Logger} from '~/lib/Logger';

const logger = new Logger('useSubscriptionActions');

export const useSubscriptionActions = () => {
	const {t} = useLingui();
	const [loadingPortal, setLoadingPortal] = React.useState(false);
	const [loadingCancel, setLoadingCancel] = React.useState(false);
	const [loadingReactivate, setLoadingReactivate] = React.useState(false);

	const handleOpenCustomerPortal = React.useCallback(async () => {
		setLoadingPortal(true);
		try {
			// TODO: Implement customer portal for CloudPayments
			logger.info('Customer portal not yet implemented');
			ToastActionCreators.error(t`Customer portal is not yet available.`);
		} catch (error) {
			logger.error('Failed to open customer portal', error);
			ToastActionCreators.error(t`Failed to open customer portal. Please try again.`);
		} finally {
			setLoadingPortal(false);
		}
	}, [t]);

	const handleCancelSubscription = React.useCallback(async () => {
		setLoadingCancel(true);
		try {
			await PremiumActionCreators.cancelSubscriptionAtPeriodEnd();
			ToastActionCreators.success(t`Your subscription has been set to cancel at the end of your billing period.`);
		} catch (error) {
			logger.error('Failed to cancel subscription', error);
			ToastActionCreators.error(t`Failed to cancel subscription. Please try again.`);
		} finally {
			setLoadingCancel(false);
		}
	}, [t]);

	const handleReactivateSubscription = React.useCallback(async () => {
		setLoadingReactivate(true);
		try {
			await PremiumActionCreators.reactivateSubscription();
			ToastActionCreators.success(t`Your subscription has been reactivated!`);
		} catch (error) {
			logger.error('Failed to reactivate subscription', error);
			ToastActionCreators.error(t`Failed to reactivate subscription. Please try again.`);
		} finally {
			setLoadingReactivate(false);
		}
	}, [t]);

	return {
		loadingPortal,
		loadingCancel,
		loadingReactivate,
		handleOpenCustomerPortal,
		handleCancelSubscription,
		handleReactivateSubscription,
	};
};
