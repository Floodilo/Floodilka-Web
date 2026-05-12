/*
 * SPDX-License-Identifier: AGPL-3.0-or-later
 * Copyright (C) 2020-2026 Fluxer Contributors
 * Copyright (C) 2026 Floodilka Contributors
 * Modified by Floodilka Contributors starting March 2026. See LICENSE and NOTICE.
 */

import {makeAutoObservable, runInAction} from 'mobx';
import {Logger} from '~/lib/Logger';
import {checkNativePermission, type NativePermissionResult} from '~/utils/NativePermissions';
import {getNativePlatform, isDesktop, type NativePlatform} from '~/utils/NativeUtils';

const logger = new Logger('NativePermissionStore');

class NativePermissionStore {
	private _initialized = false;
	private _isDesktop = false;
	private _platform: NativePlatform = 'unknown';
	private _inputMonitoringStatus: NativePermissionResult = 'granted';

	constructor() {
		makeAutoObservable(this, {}, {autoBind: true});
		void this.initialize();
	}

	private async initialize(): Promise<void> {
		const desktop = isDesktop();
		const platform = await getNativePlatform();

		let inputMonitoringStatus: NativePermissionResult = 'granted';

		if (desktop && platform === 'macos') {
			inputMonitoringStatus = await checkNativePermission('input-monitoring');
		}

		logger.debug('Initialized', {
			desktop,
			platform,
			inputMonitoringStatus,
		});

		runInAction(() => {
			this._isDesktop = desktop;
			this._platform = platform;
			this._inputMonitoringStatus = inputMonitoringStatus;
			this._initialized = true;
		});
	}

	get initialized(): boolean {
		return this._initialized;
	}

	get isDesktop(): boolean {
		return this._isDesktop;
	}

	get isMacOS(): boolean {
		return this._platform === 'macos';
	}

	get isNativeMacDesktop(): boolean {
		return this._isDesktop && this._platform === 'macos';
	}

	get platform(): NativePlatform {
		return this._platform;
	}

	get inputMonitoringStatus(): NativePermissionResult {
		return this._inputMonitoringStatus;
	}

	get isInputMonitoringGranted(): boolean {
		return this._inputMonitoringStatus === 'granted';
	}

	get shouldShowInputMonitoringBanner(): boolean {
		return this._isDesktop && this._platform === 'macos' && this._inputMonitoringStatus !== 'granted';
	}

	async recheckInputMonitoring(): Promise<NativePermissionResult> {
		if (!this._isDesktop || this._platform !== 'macos') {
			return 'granted';
		}

		const status = await checkNativePermission('input-monitoring');

		runInAction(() => {
			this._inputMonitoringStatus = status;
		});

		logger.debug('Rechecked input monitoring', {status});
		return status;
	}

	setInputMonitoringStatus(status: NativePermissionResult): void {
		this._inputMonitoringStatus = status;
	}
}

export default new NativePermissionStore();
