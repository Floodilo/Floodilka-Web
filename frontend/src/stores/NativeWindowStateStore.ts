/*
 * SPDX-License-Identifier: AGPL-3.0-or-later
 * Copyright (C) 2020-2026 Fluxer Contributors
 * Copyright (C) 2026 Floodilka Contributors
 * Modified by Floodilka Contributors starting March 2026. See LICENSE and NOTICE.
 */

import {makeAutoObservable} from 'mobx';
import {makePersistent} from '~/lib/MobXPersistence';
import {buildStateFlags, saveCurrentWindowState} from '~/utils/WindowStateUtils';

class NativeWindowStateStore {
	rememberSizeAndPosition = true;
	rememberMaximized = true;
	rememberFullscreen = true;

	constructor() {
		makeAutoObservable(this, {}, {autoBind: true});
		void makePersistent(this, 'NativeWindowStateStore', [
			'rememberSizeAndPosition',
			'rememberMaximized',
			'rememberFullscreen',
		]);
	}

	setRememberSizeAndPosition(enabled: boolean): void {
		this.rememberSizeAndPosition = enabled;
		void this.saveWithCurrentFlags();
	}

	setRememberMaximized(enabled: boolean): void {
		this.rememberMaximized = enabled;
		void this.saveWithCurrentFlags();
	}

	setRememberFullscreen(enabled: boolean): void {
		this.rememberFullscreen = enabled;
		void this.saveWithCurrentFlags();
	}

	private async saveWithCurrentFlags(): Promise<void> {
		const flags = buildStateFlags({
			rememberSizeAndPosition: this.rememberSizeAndPosition,
			rememberMaximized: this.rememberMaximized,
			rememberFullscreen: this.rememberFullscreen,
		});
		await saveCurrentWindowState(flags);
	}
}

export default new NativeWindowStateStore();
