/*
 * SPDX-License-Identifier: AGPL-3.0-or-later
 * Copyright (C) 2020-2026 Fluxer Contributors
 * Copyright (C) 2026 Floodilka Contributors
 * Modified by Floodilka Contributors starting March 2026. See LICENSE and NOTICE.
 */

import {useLingui} from '@lingui/react/macro';
import React from 'react';
import type {Prices} from '~/actions/PremiumActionCreators';
import * as PremiumActionCreators from '~/actions/PremiumActionCreators';
import * as ToastActionCreators from '~/actions/ToastActionCreators';
import {Logger} from '~/lib/Logger';

const logger = new Logger('usePremiumData');

export interface PremiumData {
	priceIds: Prices | null;
	loadingPrices: boolean;
	pricesError: boolean;
}

export const usePremiumData = (_countryCode: string | null): PremiumData => {
	const {t} = useLingui();
	const [priceIds, setPriceIds] = React.useState<Prices | null>(null);
	const [loadingPrices, setLoadingPrices] = React.useState(true);
	const [pricesError, setPricesError] = React.useState(false);

	React.useEffect(() => {
		let mounted = true;
		const fetchData = async () => {
			try {
				const prices = await PremiumActionCreators.fetchPrices();
				if (!mounted) return;
				setPriceIds(prices);
				setLoadingPrices(false);
			} catch (error) {
				logger.error('Failed to fetch premium data', error);
				if (!mounted) return;
				ToastActionCreators.error(t`Failed to load premium information. Please try again later.`);
				setPricesError(true);
				setLoadingPrices(false);
			}
		};
		fetchData();
		return () => {
			mounted = false;
		};
	}, []);

	return {
		priceIds,
		loadingPrices,
		pricesError,
	};
};
