/*
 * SPDX-License-Identifier: AGPL-3.0-or-later
 * Copyright (C) 2020-2026 Fluxer Contributors
 * Copyright (C) 2026 Floodilka Contributors
 * Modified by Floodilka Contributors starting March 2026. See LICENSE and NOTICE.
 */

import {action, makeAutoObservable} from 'mobx';
import {ME} from '~/Constants';
import type {Router} from '~/lib/router';
import NavigationCoordinator from '~/navigation/NavigationCoordinator';
import type {NavState} from '~/navigation/routeParser';

type ChannelId = string;
type GuildId = string;

class NavigationStore {
	guildId: GuildId | null = null;
	channelId: ChannelId | null = null;
	messageId: string | null = null;
	private router: Router | null = null;
	private unsubscribe: (() => void) | null = null;
	currentLocation: URL | null = null;

	constructor() {
		makeAutoObservable(this, {}, {autoBind: true});
	}

	@action
	initialize(router: Router): void {
		this.router = router;
		this.updateFromRouter();

		this.unsubscribe = this.router.subscribe(() => {
			this.updateFromRouter();
		});
	}

	@action
	private updateFromRouter(): void {
		if (!this.router) return;

		const state = this.router.getState();
		this.currentLocation = state.location;
		const match = state.matches[state.matches.length - 1];

		if (!match) {
			this.guildId = null;
			this.channelId = null;
			this.messageId = null;
			this.updateCoordinator();
			return;
		}

		const params = match.params;
		this.guildId = (params.guildId as GuildId) ?? null;
		this.channelId = (params.channelId as ChannelId) ?? null;
		this.messageId = (params.messageId as string) ?? null;
		this.updateCoordinator();
	}

	get pathname(): string {
		return this.currentLocation?.pathname ?? '';
	}

	get search(): string {
		return this.currentLocation?.search ?? '';
	}

	get hash(): string {
		return this.currentLocation?.hash ?? '';
	}

	@action
	private updateCoordinator(): void {
		const guildId = this.guildId;
		let context: NavState['context'];

		if (guildId === ME || !guildId) {
			context = {kind: 'dm'};
		} else {
			context = {kind: 'guild', guildId};
		}

		const navState: NavState = {
			context,
			channelId: this.channelId,
			messageId: this.messageId,
		};

		NavigationCoordinator.applyRoute(navState);
	}

	destroy(): void {
		if (this.unsubscribe) {
			this.unsubscribe();
			this.unsubscribe = null;
		}
		this.router = null;
	}
}

export default new NavigationStore();
