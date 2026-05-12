/*
 * SPDX-License-Identifier: AGPL-3.0-or-later
 * Copyright (C) 2020-2026 Fluxer Contributors
 * Copyright (C) 2026 Floodilka Contributors
 * Modified by Floodilka Contributors starting March 2026. See LICENSE and NOTICE.
 */

import {Routes} from '~/Routes';
import * as RouterUtils from '~/utils/RouterUtils';

export interface Navigator {
	replace: (path: string) => void;
	push: (path: string) => void;
	getPath: () => string;
}

const defaultNavigator: Navigator = {
	replace: (p: string) => RouterUtils.replaceWith(p),
	push: (p: string) => RouterUtils.transitionTo(p),
	getPath: () => RouterUtils.getHistory()?.location.pathname ?? '',
};

let inProgress = false;
let pendingTarget: string | null = null;

function computeBasePath(url: string): string | null {
	if (Routes.isDMRoute(url) && url !== Routes.ME) {
		return Routes.ME;
	}
	if (Routes.isGuildChannelRoute(url) && url.split('/').length === 4) {
		const parts = url.split('/');
		const guildId = parts[2];
		return Routes.guildChannel(guildId);
	}
	return null;
}

export function navigateToWithMobileHistory(url: string, isMobile: boolean, nav: Navigator = defaultNavigator): void {
	if (!isMobile) {
		inProgress = false;
		pendingTarget = null;
		nav.replace(url);
		return;
	}

	if (inProgress && (pendingTarget === url || pendingTarget !== null)) {
		return;
	}

	const base = computeBasePath(url);
	if (!base) {
		nav.replace(url);
		return;
	}

	const current = nav.getPath();
	if (current === base) {
		inProgress = true;
		pendingTarget = url;
		nav.push(url);
		inProgress = false;
		pendingTarget = null;
		return;
	}

	inProgress = true;
	pendingTarget = url;
	nav.replace(base);
	setTimeout(() => {
		try {
			if (pendingTarget === url) {
				nav.push(url);
			}
		} finally {
			inProgress = false;
			pendingTarget = null;
		}
	}, 0);
}

export function __resetMobileNavigationGuardsForTests() {
	inProgress = false;
	pendingTarget = null;
}
