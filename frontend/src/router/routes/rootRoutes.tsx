/*
 * SPDX-License-Identifier: AGPL-3.0-or-later
 * Copyright (C) 2020-2026 Fluxer Contributors
 * Copyright (C) 2026 Floodilka Contributors
 * Modified by Floodilka Contributors starting March 2026. See LICENSE and NOTICE.
 */

import {NotFoundPage} from '~/components/pages/NotFoundPage';
import {createRootRoute, createRoute} from '~/lib/router';
import {DownloadPage} from '~/pages/Download/DownloadPage';
import {DownloadRedirect} from '~/pages/Download/DownloadRedirect';
import {LandingPage} from '~/pages/Landing/LandingPage';
import FAQPage from '~/pages/Legal/FAQPage';
import GuidelinesPage from '~/pages/Legal/GuidelinesPage';
import PrivacyPage from '~/pages/Legal/PrivacyPage';
import SupportPage from '~/pages/Legal/SupportPage';
import TermsPage from '~/pages/Legal/TermsPage';
import {RootComponent} from '~/router/components/RootComponent';

export const rootRoute = createRootRoute({
	layout: ({children}) => <RootComponent>{children}</RootComponent>,
});

export const notFoundRoute = createRoute({
	id: '__notFound',
	path: '/__notfound',
	component: () => <NotFoundPage />,
});

export const homeRoute = createRoute({
	getParentRoute: () => rootRoute,
	id: 'home',
	path: '/',
	component: () => <LandingPage />,
});

export const privacyRoute = createRoute({
	getParentRoute: () => rootRoute,
	id: 'privacy',
	path: '/privacy',
	component: () => <PrivacyPage />,
});

export const termsRoute = createRoute({
	getParentRoute: () => rootRoute,
	id: 'terms',
	path: '/terms',
	component: () => <TermsPage />,
});

export const supportRoute = createRoute({
	getParentRoute: () => rootRoute,
	id: 'support',
	path: '/support',
	component: () => <SupportPage />,
});

export const downloadRoute = createRoute({
	getParentRoute: () => rootRoute,
	id: 'download',
	path: '/download',
	component: () => <DownloadPage />,
});

export const downloadAppRoute = createRoute({
	getParentRoute: () => rootRoute,
	id: 'downloadApp',
	path: '/download/app',
	component: () => <DownloadRedirect />,
});

export const faqRoute = createRoute({
	getParentRoute: () => rootRoute,
	id: 'faq',
	path: '/faq',
	component: () => <FAQPage />,
});

export const guidelinesRoute = createRoute({
	getParentRoute: () => rootRoute,
	id: 'guidelines',
	path: '/guidelines',
	component: () => <GuidelinesPage />,
});
