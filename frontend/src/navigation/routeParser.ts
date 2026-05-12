/*
 * SPDX-License-Identifier: AGPL-3.0-or-later
 * Copyright (C) 2020-2026 Fluxer Contributors
 * Copyright (C) 2026 Floodilka Contributors
 * Modified by Floodilka Contributors starting March 2026. See LICENSE and NOTICE.
 */

import {ME} from '~/Constants';
import type {ViewContext} from './NavigationCoordinator';

interface NavState {
	context: ViewContext;
	channelId: string | null;
	messageId: string | null;
}

interface LocationLike {
	pathname: string;
}

function parseNavState(location: LocationLike): NavState {
	const pathname = location.pathname;
	const segments = pathname.split('/').filter(Boolean);

	if (segments.length < 2 || segments[0] !== 'channels') {
		return {
			context: {kind: 'dm'},
			channelId: null,
			messageId: null,
		};
	}

	const guildId = segments[1];
	const channelId = segments[2] ?? null;
	const messageId = segments[3] ?? null;

	let context: ViewContext;

	if (guildId === ME) {
		context = {kind: 'dm'};
	} else {
		context = {kind: 'guild', guildId};
	}

	return {
		context,
		channelId,
		messageId,
	};
}

function normalizeRoute(location: LocationLike): string | null {
	const state = parseNavState(location);

	if (state.context.kind === 'dm' && !state.channelId) {
		return `/channels/@me`;
	}

	if (state.context.kind === 'guild' && !state.channelId) {
		return `/channels/${state.context.guildId}`;
	}

	return null;
}

export type {NavState};
export {parseNavState, normalizeRoute};
