/*
 * SPDX-License-Identifier: AGPL-3.0-or-later
 * Copyright (C) 2020-2026 Fluxer Contributors
 * Copyright (C) 2026 Floodilka Contributors
 * Modified by Floodilka Contributors starting March 2026. See LICENSE and NOTICE.
 */

import {makeAutoObservable} from 'mobx';
import type {ScheduledMessagePayload, ScheduledMessageRecord} from '~/records/ScheduledMessageRecord';

interface ScheduledMessageEditState {
	scheduledMessageId: string;
	channelId: string;
	payload: ScheduledMessagePayload;
	scheduledLocalAt: string;
	timezone: string;
}

class ScheduledMessageEditorStore {
	private state: ScheduledMessageEditState | null = null;

	constructor() {
		makeAutoObservable(this, {}, {autoBind: true});
	}

	startEditing(record: ScheduledMessageRecord): void {
		this.state = {
			scheduledMessageId: record.id,
			channelId: record.channelId,
			payload: record.payload,
			scheduledLocalAt: record.scheduledLocalAt,
			timezone: record.timezone,
		};
	}

	stopEditing(): void {
		this.state = null;
	}

	isEditingChannel(channelId: string): boolean {
		return this.state?.channelId === channelId;
	}

	getEditingState(): ScheduledMessageEditState | null {
		return this.state;
	}
}

export default new ScheduledMessageEditorStore();
