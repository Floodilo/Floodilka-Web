/*
 * SPDX-License-Identifier: AGPL-3.0-or-later
 * Copyright (C) 2020-2026 Fluxer Contributors
 * Copyright (C) 2026 Floodilka Contributors
 * Modified by Floodilka Contributors starting March 2026. See LICENSE and NOTICE.
 */

import {makeAutoObservable} from 'mobx';

class MessageEditMobileStore {
	editingMessageIds: Record<string, string> = {};

	constructor() {
		makeAutoObservable(this, {}, {autoBind: true});
	}

	startEditingMobile(channelId: string, messageId: string): void {
		this.editingMessageIds = {
			...this.editingMessageIds,
			[channelId]: messageId,
		};
	}

	stopEditingMobile(channelId: string): void {
		const {[channelId]: _, ...remainingEdits} = this.editingMessageIds;
		this.editingMessageIds = remainingEdits;
	}

	isEditingMobile(channelId: string, messageId: string): boolean {
		return this.editingMessageIds[channelId] === messageId;
	}

	getEditingMobileMessageId(channelId: string): string | null {
		return this.editingMessageIds[channelId] ?? null;
	}
}

export default new MessageEditMobileStore();
