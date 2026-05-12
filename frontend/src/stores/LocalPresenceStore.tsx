/*
 * SPDX-License-Identifier: AGPL-3.0-or-later
 * Copyright (C) 2020-2026 Fluxer Contributors
 * Copyright (C) 2026 Floodilka Contributors
 * Modified by Floodilka Contributors starting March 2026. See LICENSE and NOTICE.
 */

import {makeAutoObservable, reaction} from 'mobx';
import type {StatusType} from '~/Constants';
import {StatusTypes} from '~/Constants';
import {
	type CustomStatus,
	customStatusToKey,
	type GatewayCustomStatusPayload,
	normalizeCustomStatus,
	toGatewayCustomStatus,
} from '~/lib/customStatus';
import MobileLayoutStore from '~/stores/MobileLayoutStore';
import UserSettingsStore from '~/stores/UserSettingsStore';

type Presence = Readonly<{
	status: StatusType;
	since: number;
	afk: boolean;
	mobile: boolean;
	custom_status: GatewayCustomStatusPayload | null;
}>;

class LocalPresenceStore {
	status: StatusType = StatusTypes.ONLINE;

	since: number = 0;

	afk: boolean = false;

	mobile: boolean = false;

	customStatus: CustomStatus | null = null;

	constructor() {
		makeAutoObservable(this, {}, {autoBind: true});

		reaction(
			() => MobileLayoutStore.isMobileLayout(),
			() => this.updatePresence(),
		);
	}

	reset(): void {
		this.status = StatusTypes.ONLINE;
		this.since = 0;
		this.afk = false;
		this.mobile = false;
		this.customStatus = null;
	}

	updatePresence(): void {
		const userStatus = UserSettingsStore.status;
		const isMobile = MobileLayoutStore.isMobileLayout();

		const normalizedCustomStatus = normalizeCustomStatus(UserSettingsStore.getCustomStatus());
		this.customStatus = normalizedCustomStatus ? {...normalizedCustomStatus} : null;
		this.status = userStatus;
		this.since = 0;
		this.afk = false;
		this.mobile = isMobile;
	}

	getStatus(): StatusType {
		return this.status;
	}

	getPresence(): Presence {
		return {
			status: this.status,
			since: this.since,
			afk: this.afk,
			mobile: this.mobile,
			custom_status: toGatewayCustomStatus(this.customStatus),
		};
	}

	get presenceFingerprint(): string {
		return `${this.status}|${customStatusToKey(this.customStatus)}`;
	}
}

export default new LocalPresenceStore();
