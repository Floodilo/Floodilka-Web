/*
 * SPDX-License-Identifier: AGPL-3.0-or-later
 * Copyright (C) 2020-2026 Fluxer Contributors
 * Copyright (C) 2026 Floodilka Contributors
 * Modified by Floodilka Contributors starting March 2026. See LICENSE and NOTICE.
 */

import {makeAutoObservable} from 'mobx';

const BASE_Z_INDEX = 10000;
const Z_INDEX_INCREMENT = 10;

class OverlayStackStore {
	private counter = 0;

	constructor() {
		makeAutoObservable(this, {}, {autoBind: true});
	}

	acquire(): number {
		const zIndex = BASE_Z_INDEX + this.counter * Z_INDEX_INCREMENT;
		this.counter++;
		return zIndex;
	}

	release(): void {
		if (this.counter > 0) {
			this.counter--;
		}
	}

	peek(): number {
		return BASE_Z_INDEX + this.counter * Z_INDEX_INCREMENT;
	}

	reset(): void {
		this.counter = 0;
	}
}

export default new OverlayStackStore();
