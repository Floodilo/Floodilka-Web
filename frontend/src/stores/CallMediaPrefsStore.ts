/*
 * SPDX-License-Identifier: AGPL-3.0-or-later
 * Copyright (C) 2020-2026 Fluxer Contributors
 * Copyright (C) 2026 Floodilka Contributors
 * Modified by Floodilka Contributors starting March 2026. See LICENSE and NOTICE.
 */

import {makeAutoObservable} from 'mobx';

interface CallScopedPrefs {
	disabledVideoByIdentity: Record<string, boolean>;
}

class CallMediaPrefsStore {
	private byCall: Record<string, CallScopedPrefs> = {};

	constructor() {
		makeAutoObservable(this, {}, {autoBind: true});
	}

	private ensure(callId: string): CallScopedPrefs {
		return (this.byCall[callId] ||= {disabledVideoByIdentity: {}});
	}

	isVideoDisabled(callId: string, identity: string): boolean {
		return !!this.byCall[callId]?.disabledVideoByIdentity[identity];
	}

	setVideoDisabled(callId: string, identity: string, disabled: boolean): void {
		const scope = this.ensure(callId);
		scope.disabledVideoByIdentity = {
			...scope.disabledVideoByIdentity,
			[identity]: disabled,
		};
	}

	clearForCall(callId: string): void {
		delete this.byCall[callId];
	}
}

export default new CallMediaPrefsStore();
export {CallMediaPrefsStore};
