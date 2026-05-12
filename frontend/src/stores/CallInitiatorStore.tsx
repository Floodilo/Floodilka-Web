/*
 * SPDX-License-Identifier: AGPL-3.0-or-later
 * Copyright (C) 2020-2026 Fluxer Contributors
 * Copyright (C) 2026 Floodilka Contributors
 * Modified by Floodilka Contributors starting March 2026. See LICENSE and NOTICE.
 */

import {makeAutoObservable} from 'mobx';

class CallInitiatorStore {
	private initiatedRecipients = new Map<string, Set<string>>();

	constructor() {
		makeAutoObservable(this, {}, {autoBind: true});
	}

	markInitiated(channelId: string, recipients: ReadonlyArray<string>): void {
		const filtered = recipients.filter(Boolean);
		if (filtered.length === 0) {
			this.initiatedRecipients.delete(channelId);
			return;
		}

		this.initiatedRecipients.set(channelId, new Set(filtered));
	}

	getInitiatedRecipients(channelId: string): Array<string> {
		const recipients = this.initiatedRecipients.get(channelId);
		return recipients ? Array.from(recipients) : [];
	}

	clearChannel(channelId: string): void {
		this.initiatedRecipients.delete(channelId);
	}
}

export default new CallInitiatorStore();
