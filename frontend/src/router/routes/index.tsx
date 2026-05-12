/*
 * SPDX-License-Identifier: AGPL-3.0-or-later
 * Copyright (C) 2020-2026 Fluxer Contributors
 * Copyright (C) 2026 Floodilka Contributors
 * Modified by Floodilka Contributors starting March 2026. See LICENSE and NOTICE.
 */

import type {RouteConfig} from '~/lib/router';
import {appRouteTree} from '~/router/routes/appRoutes';
import {authRouteTree, glassRouteTree} from '~/router/routes/authRoutes';
import {downloadAppRoute, downloadRoute, faqRoute, guidelinesRoute, homeRoute, notFoundRoute, privacyRoute, rootRoute, supportRoute, termsRoute} from '~/router/routes/rootRoutes';

const routeTree = rootRoute.addChildren([homeRoute, downloadRoute, downloadAppRoute, privacyRoute, termsRoute, supportRoute, faqRoute, guidelinesRoute, notFoundRoute, glassRouteTree, authRouteTree, appRouteTree]);

export const buildRoutes = (): Array<RouteConfig> => routeTree.build();
