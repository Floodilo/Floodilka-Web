/*
 * SPDX-License-Identifier: AGPL-3.0-or-later
 * Copyright (C) 2020-2026 Fluxer Contributors
 * Copyright (C) 2026 Floodilka Contributors
 * Modified by Floodilka Contributors starting March 2026. See LICENSE and NOTICE.
 */

import {createRouter} from '~/lib/router';
import {buildRoutes} from '~/router/routes';
import NavigationStore from '~/stores/NavigationStore';
import * as RouterUtils from '~/utils/RouterUtils';

const routes = buildRoutes();

export const router = createRouter({
	routes,
	history: RouterUtils.getHistory() ?? undefined,
	notFoundRouteId: '__notFound',
	scrollRestoration: 'top',
});

NavigationStore.initialize(router);
