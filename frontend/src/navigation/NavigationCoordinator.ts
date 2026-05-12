/*
 * SPDX-License-Identifier: AGPL-3.0-or-later
 * Copyright (C) 2020-2026 Fluxer Contributors
 * Copyright (C) 2026 Floodilka Contributors
 * Modified by Floodilka Contributors starting March 2026. See LICENSE and NOTICE.
 */

import {action, makeAutoObservable} from 'mobx';
import * as RouterUtils from '~/utils/RouterUtils';
import type {NavState} from './routeParser';

type ViewContext = {kind: 'dm'} | {kind: 'guild'; guildId: string};

class NavigationStore {
	context: ViewContext = {kind: 'dm'};
	channelId: string | null = null;
	messageId: string | null = null;

	constructor() {
		makeAutoObservable(this, {}, {autoBind: true});
	}

	@action
	setState(state: NavState): void {
		this.context = state.context;
		this.channelId = state.channelId;
		this.messageId = state.messageId;
	}

	@action
	reset(): void {
		this.context = {kind: 'dm'};
		this.channelId = null;
		this.messageId = null;
	}
}

class NavigationCoordinator {
	private readonly store: NavigationStore;

	constructor() {
		this.store = new NavigationStore();
	}

	get currentContext(): ViewContext {
		return this.store.context;
	}

	get currentChannelId(): string | null {
		return this.store.channelId;
	}

	get currentMessageId(): string | null {
		return this.store.messageId;
	}

	@action
	applyRoute(state: NavState): void {
		this.store.setState(state);
	}

	@action
	navigateToGuild(guildId: string, channelId?: string, messageId?: string): void {
		const state: NavState = {
			context: {kind: 'guild', guildId},
			channelId: channelId ?? null,
			messageId: messageId ?? null,
		};

		this.applyRoute(state);

		if (messageId) {
			RouterUtils.transitionTo(`/channels/${guildId}/${channelId}/${messageId}`);
		} else if (channelId) {
			RouterUtils.transitionTo(`/channels/${guildId}/${channelId}`);
		} else {
			RouterUtils.transitionTo(`/channels/${guildId}`);
		}
	}

	@action
	navigateToDM(channelId?: string, messageId?: string): void {
		const state: NavState = {
			context: {kind: 'dm'},
			channelId: channelId ?? null,
			messageId: messageId ?? null,
		};

		this.applyRoute(state);

		if (messageId && channelId) {
			RouterUtils.transitionTo(`/channels/@me/${channelId}/${messageId}`);
		} else if (channelId) {
			RouterUtils.transitionTo(`/channels/@me/${channelId}`);
		} else {
			RouterUtils.transitionTo('/channels/@me');
		}
	}

	@action
	reset(): void {
		this.store.reset();
	}
}

const navigationCoordinator = new NavigationCoordinator();

export type {ViewContext, NavState};
export {NavigationStore, NavigationCoordinator};
export default navigationCoordinator;
