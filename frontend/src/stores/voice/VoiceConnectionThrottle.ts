/*
 * SPDX-License-Identifier: AGPL-3.0-or-later
 * Copyright (C) 2020-2026 Fluxer Contributors
 * Copyright (C) 2026 Floodilka Contributors
 * Modified by Floodilka Contributors starting March 2026. See LICENSE and NOTICE.
 */

import {makeAutoObservable, runInAction} from 'mobx';

export interface ConnectionThrottleState {
	connectAttemptId: number;
	inFlightConnect: boolean;
}

const initialThrottleState: ConnectionThrottleState = {
	connectAttemptId: 0,
	inFlightConnect: false,
};

export class VoiceConnectionThrottle {
	throttleState: ConnectionThrottleState = initialThrottleState;

	constructor() {
		makeAutoObservable(this, {}, {autoBind: true});
	}

	get connectAttemptId(): number {
		return this.throttleState.connectAttemptId;
	}

	get inFlightConnect(): boolean {
		return this.throttleState.inFlightConnect;
	}

	isLatestAttempt(id: number): boolean {
		return id === this.throttleState.connectAttemptId;
	}

	incrementAttemptId(): void {
		runInAction(() => {
			this.throttleState = {
				...this.throttleState,
				connectAttemptId: this.throttleState.connectAttemptId + 1,
			};
		});
	}

	setInFlightConnect(value: boolean): void {
		runInAction(() => {
			this.throttleState = {
				...this.throttleState,
				inFlightConnect: value,
			};
		});
	}

	reset(): void {
		runInAction(() => {
			this.throttleState = initialThrottleState;
		});
	}
}
