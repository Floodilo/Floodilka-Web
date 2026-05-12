/*
 * SPDX-License-Identifier: AGPL-3.0-or-later
 * Copyright (C) 2020-2026 Fluxer Contributors
 * Copyright (C) 2026 Floodilka Contributors
 * Modified by Floodilka Contributors starting March 2026. See LICENSE and NOTICE.
 */

import {observer} from 'mobx-react-lite';
import {useEffect} from 'react';
import {useLayoutVariant} from '~/contexts/LayoutVariantContext';
import AuthenticationStore from '~/stores/AuthenticationStore';
import NewDeviceMonitoringStore from '~/stores/NewDeviceMonitoringStore';

export const NewDeviceMonitoringManager = observer(() => {
	const isAuthenticated = AuthenticationStore.isAuthenticated;
	const variant = useLayoutVariant();
	const shouldRun = isAuthenticated && variant === 'app';

	useEffect(() => {
		if (!shouldRun) {
			return;
		}

		void NewDeviceMonitoringStore.start();

		return () => {
			NewDeviceMonitoringStore.dispose();
		};
	}, [shouldRun]);

	return null;
});
