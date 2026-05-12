/*
 * SPDX-License-Identifier: AGPL-3.0-or-later
 * Copyright (C) 2020-2026 Fluxer Contributors
 * Copyright (C) 2026 Floodilka Contributors
 * Modified by Floodilka Contributors starting March 2026. See LICENSE and NOTICE.
 */

import {useCallback, useEffect, useState} from 'react';
import {Endpoints} from '~/Endpoints';
import http from '~/lib/HttpClient';
import {Logger} from '~/lib/Logger';

const logger = new Logger('PushSubscriptions');

export interface PushSubscriptionInfo {
	subscription_id: string;
	user_agent: string | null;
}

export const usePushSubscriptions = (enabled: boolean) => {
	const [subscriptions, setSubscriptions] = useState<Array<PushSubscriptionInfo>>([]);
	const [loading, setLoading] = useState(false);

	const fetchSubscriptions = useCallback(async () => {
		if (!enabled) {
			setSubscriptions([]);
			return;
		}

		setLoading(true);
		try {
			const response = await http.get<{subscriptions: Array<PushSubscriptionInfo>}>({
				url: Endpoints.USER_PUSH_SUBSCRIPTIONS,
			});
			setSubscriptions(response.body.subscriptions ?? []);
		} catch (error) {
			logger.error('Failed to load push subscriptions', {error});
			setSubscriptions([]);
		} finally {
			setLoading(false);
		}
	}, [enabled]);

	useEffect(() => {
		void fetchSubscriptions();
	}, [fetchSubscriptions]);

	return {
		subscriptions,
		loading,
		refresh: fetchSubscriptions,
	};
};
