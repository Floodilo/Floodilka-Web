/*
 * SPDX-License-Identifier: AGPL-3.0-or-later
 * Copyright (C) 2020-2026 Fluxer Contributors
 * Copyright (C) 2026 Floodilka Contributors
 * Modified by Floodilka Contributors starting March 2026. See LICENSE and NOTICE.
 */

import {makeAutoObservable} from 'mobx';
import {Logger} from '~/lib/Logger';

const logger = new Logger('UserNoteStore');

class UserNoteStore {
	notes: Record<string, string> = {};

	constructor() {
		makeAutoObservable(this, {}, {autoBind: true});
	}

	loadNotes(notes: Record<string, string>): void {
		logger.debug('Loading user notes');
		this.notes = {...notes};
	}

	updateUserNote(userId: string, note: string): void {
		if (!note) {
			const {[userId]: _, ...remainingNotes} = this.notes;
			this.notes = remainingNotes;
			logger.debug(`Removed note for user ${userId}`);
		} else if (this.notes[userId] !== note) {
			this.notes = {
				...this.notes,
				[userId]: note,
			};
			logger.debug(`Updated note for user ${userId}`);
		}
	}

	clearNote(userId: string): void {
		this.updateUserNote(userId, '');
	}

	getUserNote(userId: string): string {
		return this.notes[userId] ?? '';
	}

	hasNote(userId: string): boolean {
		return userId in this.notes && this.notes[userId].length > 0;
	}
}

export default new UserNoteStore();
