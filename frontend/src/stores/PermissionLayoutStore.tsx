/*
 * SPDX-License-Identifier: AGPL-3.0-or-later
 * Copyright (C) 2020-2026 Fluxer Contributors
 * Copyright (C) 2026 Floodilka Contributors
 * Modified by Floodilka Contributors starting March 2026. See LICENSE and NOTICE.
 */

import {makeAutoObservable} from 'mobx';
import {makePersistent} from '~/lib/MobXPersistence';

export enum PermissionLayoutMode {
	COMFY = 'comfy',
	DENSE = 'dense',
}

export enum PermissionGridMode {
	SINGLE = 'single',
	GRID = 'grid',
}

class PermissionLayoutStore {
	layoutMode: PermissionLayoutMode = PermissionLayoutMode.COMFY;
	gridMode: PermissionGridMode = PermissionGridMode.SINGLE;

	constructor() {
		makeAutoObservable(this, {}, {autoBind: true});
		this.initPersistence();
	}

	private async initPersistence(): Promise<void> {
		await makePersistent(this, 'PermissionLayoutStore', ['layoutMode', 'gridMode']);
	}

	get isComfy(): boolean {
		return this.layoutMode === PermissionLayoutMode.COMFY;
	}

	get isDense(): boolean {
		return this.layoutMode === PermissionLayoutMode.DENSE;
	}

	get isGrid(): boolean {
		return this.gridMode === PermissionGridMode.GRID;
	}

	setLayoutMode(mode: PermissionLayoutMode): void {
		this.layoutMode = mode;
	}

	setGridMode(mode: PermissionGridMode): void {
		this.gridMode = mode;
	}

	toggleLayoutMode(): void {
		this.layoutMode = this.isComfy ? PermissionLayoutMode.DENSE : PermissionLayoutMode.COMFY;
	}

	toggleGridMode(): void {
		this.gridMode = this.isGrid ? PermissionGridMode.SINGLE : PermissionGridMode.GRID;
	}
}

export default new PermissionLayoutStore();
