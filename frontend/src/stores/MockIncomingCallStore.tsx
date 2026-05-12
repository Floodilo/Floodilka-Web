/*
 * SPDX-License-Identifier: AGPL-3.0-or-later
 * Copyright (C) 2020-2026 Fluxer Contributors
 * Copyright (C) 2026 Floodilka Contributors
 * Modified by Floodilka Contributors starting March 2026. See LICENSE and NOTICE.
 */

import {makeAutoObservable} from 'mobx';
import type {ChannelRecord} from '~/records/ChannelRecord';
import type {UserRecord} from '~/records/UserRecord';

interface MockIncomingCallData {
	channel: ChannelRecord;
	initiator: UserRecord;
}

class MockIncomingCallStore {
	mockCall: MockIncomingCallData | null = null;

	constructor() {
		makeAutoObservable(this);
	}

	setMockCall(data: MockIncomingCallData): void {
		this.mockCall = data;
	}

	clearMockCall(): void {
		this.mockCall = null;
	}

	isMockCall(channelId: string): boolean {
		return this.mockCall?.channel.id === channelId;
	}
}

export default new MockIncomingCallStore();
