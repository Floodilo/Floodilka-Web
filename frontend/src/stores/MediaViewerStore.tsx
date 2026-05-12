/*
 * SPDX-License-Identifier: AGPL-3.0-or-later
 * Copyright (C) 2020-2026 Fluxer Contributors
 * Copyright (C) 2026 Floodilka Contributors
 * Modified by Floodilka Contributors starting March 2026. See LICENSE and NOTICE.
 */

import {makeAutoObservable} from 'mobx';
import type {MessageRecord} from '~/records/MessageRecord';

export type MediaViewerItem = Readonly<{
	src: string;
	originalSrc: string;
	naturalWidth: number;
	naturalHeight: number;
	type: 'image' | 'gif' | 'gifv' | 'video' | 'audio';
	contentHash?: string | null;
	attachmentId?: string;
	embedIndex?: number;
	filename?: string;
	fileSize?: number;
	duration?: number;
	expiresAt?: string | null;
	expired?: boolean;
}>;

class MediaViewerStore {
	isOpen: boolean = false;
	items: ReadonlyArray<MediaViewerItem> = [];
	currentIndex: number = 0;
	channelId?: string = undefined;
	messageId?: string = undefined;
	message?: MessageRecord = undefined;

	constructor() {
		makeAutoObservable(this, {}, {autoBind: true});
	}

	open(
		items: ReadonlyArray<MediaViewerItem>,
		currentIndex: number,
		channelId?: string,
		messageId?: string,
		message?: MessageRecord,
	): void {
		this.isOpen = true;
		this.items = items;
		this.currentIndex = currentIndex;
		this.channelId = channelId;
		this.messageId = messageId;
		this.message = message;
	}

	close(): void {
		this.isOpen = false;
		this.items = [];
		this.currentIndex = 0;
		this.channelId = undefined;
		this.messageId = undefined;
		this.message = undefined;
	}

	navigate(index: number): void {
		if (index < 0 || index >= this.items.length) {
			return;
		}

		this.currentIndex = index;
	}

	getCurrentItem(): MediaViewerItem | undefined {
		if (!this.isOpen || this.items.length === 0) {
			return;
		}
		return this.items[this.currentIndex];
	}

	canNavigatePrevious(): boolean {
		return this.isOpen && this.currentIndex > 0;
	}

	canNavigateNext(): boolean {
		return this.isOpen && this.currentIndex < this.items.length - 1;
	}
}

export default new MediaViewerStore();
