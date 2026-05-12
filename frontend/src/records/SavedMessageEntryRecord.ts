/*
 * SPDX-License-Identifier: AGPL-3.0-or-later
 * Copyright (C) 2020-2026 Fluxer Contributors
 * Copyright (C) 2026 Floodilka Contributors
 * Modified by Floodilka Contributors starting March 2026. See LICENSE and NOTICE.
 */

import {type Message, MessageRecord} from '~/records/MessageRecord';

export interface SavedMessageEntryResponse {
	id: string;
	channel_id: string;
	message_id: string;
	status: SavedMessageStatus;
	message: Message | null;
}

export type SavedMessageStatus = 'available' | 'missing_permissions';

export interface SavedMessageMissingEntry {
	id: string;
	channelId: string;
	messageId: string;
}

export class SavedMessageEntryRecord {
	readonly id: string;
	readonly channelId: string;
	readonly messageId: string;
	readonly status: SavedMessageStatus;
	readonly message: MessageRecord | null;

	constructor(data: SavedMessageEntryResponse) {
		this.id = data.id;
		this.channelId = data.channel_id;
		this.messageId = data.message_id;
		this.status = data.status;
		this.message = data.message ? new MessageRecord(data.message) : null;
	}

	static fromResponse(response: SavedMessageEntryResponse): SavedMessageEntryRecord {
		return new SavedMessageEntryRecord(response);
	}

	toMissingEntry(): SavedMessageMissingEntry {
		return {
			id: this.id,
			channelId: this.channelId,
			messageId: this.messageId,
		};
	}
}
