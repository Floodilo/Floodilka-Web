/*
 * SPDX-License-Identifier: AGPL-3.0-or-later
 * Copyright (C) 2020-2026 Fluxer Contributors
 * Copyright (C) 2026 Floodilka Contributors
 * Modified by Floodilka Contributors starting March 2026. See LICENSE and NOTICE.
 */

import {makeAutoObservable} from 'mobx';
import * as UserProfileActionCreators from '~/actions/UserProfileActionCreators';

interface UserProfileMobileState {
	userId: string | null;
	guildId?: string;
	autoFocusNote?: boolean;
}

class UserProfileMobileStore {
	userId: UserProfileMobileState['userId'] = null;
	guildId: UserProfileMobileState['guildId'] = undefined;
	autoFocusNote: UserProfileMobileState['autoFocusNote'] = undefined;

	constructor() {
		makeAutoObservable(this, {}, {autoBind: true});
	}

	get isOpen(): boolean {
		return this.userId !== null;
	}

	open(userId: string, guildId?: string, autoFocusNote?: boolean): void {
		this.userId = userId;
		this.guildId = guildId;
		this.autoFocusNote = autoFocusNote;
		UserProfileActionCreators.fetch(userId, guildId).catch((error) => {
			console.error('Failed to fetch user profile:', error);
		});
	}

	close(): void {
		this.userId = null;
		this.guildId = undefined;
		this.autoFocusNote = undefined;
	}
}

export default new UserProfileMobileStore();
