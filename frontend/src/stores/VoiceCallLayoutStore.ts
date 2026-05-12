/*
 * SPDX-License-Identifier: AGPL-3.0-or-later
 * Copyright (C) 2020-2026 Fluxer Contributors
 * Copyright (C) 2026 Floodilka Contributors
 * Modified by Floodilka Contributors starting March 2026. See LICENSE and NOTICE.
 */

import {makeAutoObservable} from 'mobx';

export type LayoutMode = 'grid' | 'focus';

class VoiceCallLayoutStore {
	layoutMode: LayoutMode = 'grid';
	pinnedParticipantIdentity: string | null = null;
	userOverride = false;

	constructor() {
		makeAutoObservable(this, {}, {autoBind: true});
	}

	getLayoutMode(): LayoutMode {
		return this.layoutMode;
	}

	getPinnedParticipantIdentity(): string | null {
		return this.pinnedParticipantIdentity;
	}

	setLayoutMode(mode: LayoutMode): void {
		this.layoutMode = mode;
	}

	setPinnedParticipant(identity: string | null): void {
		this.pinnedParticipantIdentity = identity;
		this.layoutMode = identity ? 'focus' : 'grid';
	}

	setUserOverride(value: boolean): void {
		this.userOverride = value;
	}

	markUserOverride(): void {
		this.userOverride = true;
	}

	toggleLayoutMode(): void {
		const newLayoutMode = this.layoutMode === 'grid' ? 'focus' : 'grid';
		this.layoutMode = newLayoutMode;
		if (this.layoutMode === 'grid') {
			this.pinnedParticipantIdentity = null;
		}
	}

	clearPinnedParticipant(): void {
		this.pinnedParticipantIdentity = null;
		this.layoutMode = 'grid';
	}

	reset(): void {
		this.layoutMode = 'grid';
		this.pinnedParticipantIdentity = null;
		this.userOverride = false;
	}
}

export default new VoiceCallLayoutStore();
