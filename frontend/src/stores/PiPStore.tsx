/*
 * SPDX-License-Identifier: AGPL-3.0-or-later
 * Copyright (C) 2020-2026 Fluxer Contributors
 * Copyright (C) 2026 Floodilka Contributors
 * Modified by Floodilka Contributors starting March 2026. See LICENSE and NOTICE.
 */

import {makeAutoObservable, runInAction} from 'mobx';
import AppStorage from '~/lib/AppStorage';

type PiPContentType = 'stream' | 'camera';
type PiPCorner = 'top-left' | 'top-right' | 'bottom-right' | 'bottom-left';
const PIP_DEFAULT_WIDTH = 320;

interface PiPContent {
	type: PiPContentType;
	participantIdentity: string;
	channelId: string;
	guildId: string | null;
	connectionId: string;
	userId: string;
}

const PIP_CORNER_STORAGE_KEY = 'pip_corner';
const PIP_WIDTH_STORAGE_KEY = 'pip_width';
const PIP_CORNERS: ReadonlyArray<PiPCorner> = ['top-left', 'top-right', 'bottom-right', 'bottom-left'];

function isPiPCorner(value: string | null): value is PiPCorner {
	if (!value) return false;
	return PIP_CORNERS.includes(value as PiPCorner);
}

function parsePiPWidth(value: string | null): number | null {
	if (!value) return null;
	const parsed = Number(value);
	if (!Number.isFinite(parsed) || parsed <= 0) return null;
	return parsed;
}

class PiPStore {
	isOpen = false;
	content: PiPContent | null = null;
	focusedTileMirrorContent: PiPContent | null = null;
	corner: PiPCorner = 'bottom-right';
	temporaryCornerOverride: PiPCorner | null = null;
	sessionDisable = false;
	width = PIP_DEFAULT_WIDTH;

	constructor() {
		makeAutoObservable(this, {}, {autoBind: true});
		const storedCorner = AppStorage.getItem(PIP_CORNER_STORAGE_KEY);
		if (isPiPCorner(storedCorner)) {
			this.corner = storedCorner;
		}
		const storedWidth = parsePiPWidth(AppStorage.getItem(PIP_WIDTH_STORAGE_KEY));
		if (storedWidth != null) {
			this.width = storedWidth;
		}
	}

	open(content: PiPContent): void {
		runInAction(() => {
			this.isOpen = true;
			this.content = content;
		});
	}

	close(): void {
		runInAction(() => {
			this.isOpen = false;
			this.content = null;
		});
	}

	showFocusedTileMirror(content: PiPContent, corner: PiPCorner = 'top-right'): void {
		runInAction(() => {
			this.focusedTileMirrorContent = content;
			this.temporaryCornerOverride = corner;
		});
	}

	hideFocusedTileMirror(): void {
		runInAction(() => {
			this.focusedTileMirrorContent = null;
			this.temporaryCornerOverride = null;
		});
	}

	setSessionDisable(value: boolean): void {
		runInAction(() => {
			this.sessionDisable = value;
		});
	}

	setCorner(corner: PiPCorner): void {
		runInAction(() => {
			this.corner = corner;
		});
		AppStorage.setItem(PIP_CORNER_STORAGE_KEY, corner);
	}

	setWidth(width: number): void {
		runInAction(() => {
			this.width = width;
		});
		AppStorage.setItem(PIP_WIDTH_STORAGE_KEY, `${width}`);
	}

	getContent(): PiPContent | null {
		return this.content;
	}

	getActiveContent(): PiPContent | null {
		return this.focusedTileMirrorContent ?? this.content;
	}

	getIsOpen(): boolean {
		return this.isOpen;
	}

	getHasActiveOverlay(): boolean {
		return this.focusedTileMirrorContent != null || this.isOpen;
	}

	getCorner(): PiPCorner {
		return this.corner;
	}

	getEffectiveCorner(): PiPCorner {
		return this.temporaryCornerOverride ?? this.corner;
	}

	getSessionDisable(): boolean {
		return this.sessionDisable;
	}

	getWidth(): number {
		return this.width;
	}
}

export {PIP_DEFAULT_WIDTH};
export type {PiPContent, PiPContentType, PiPCorner};
export default new PiPStore();
