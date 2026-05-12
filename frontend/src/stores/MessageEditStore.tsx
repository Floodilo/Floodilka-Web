/*
 * SPDX-License-Identifier: AGPL-3.0-or-later
 * Copyright (C) 2020-2026 Fluxer Contributors
 * Copyright (C) 2026 Floodilka Contributors
 * Modified by Floodilka Contributors starting March 2026. See LICENSE and NOTICE.
 */

import {makeAutoObservable, reaction} from 'mobx';

interface EditingState {
	messageId: string;
	content: string;
}

class MessageEditStore {
	private editingStates: Record<string, EditingState> = {};

	constructor() {
		makeAutoObservable(this, {}, {autoBind: true});
	}

	startEditing(channelId: string, messageId: string, initialContent: string): void {
		const currentState = this.editingStates[channelId];
		if (currentState?.messageId === messageId && currentState.content === initialContent) {
			return;
		}

		this.editingStates = {
			...this.editingStates,
			[channelId]: {
				messageId,
				content: initialContent,
			},
		};
	}

	stopEditing(channelId: string): void {
		const {[channelId]: _, ...remainingEdits} = this.editingStates;
		this.editingStates = remainingEdits;
	}

	isEditing(channelId: string, messageId: string): boolean {
		const state = this.editingStates[channelId];
		return state?.messageId === messageId;
	}

	getEditingMessageId(channelId: string): string | null {
		return this.editingStates[channelId]?.messageId ?? null;
	}

	setEditingContent(channelId: string, messageId: string, content: string): void {
		const state = this.editingStates[channelId];
		if (!state || state.messageId !== messageId || state.content === content) {
			return;
		}

		this.editingStates = {
			...this.editingStates,
			[channelId]: {
				...state,
				content,
			},
		};
	}

	getEditingContent(channelId: string, messageId: string): string | null {
		const state = this.editingStates[channelId];
		if (!state || state.messageId !== messageId) {
			return null;
		}

		return state.content;
	}

	subscribe(callback: () => void): () => void {
		return reaction(
			() => this.editingStates,
			() => callback(),
			{fireImmediately: true},
		);
	}
}

export default new MessageEditStore();
