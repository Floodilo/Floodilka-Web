/*
 * SPDX-License-Identifier: AGPL-3.0-or-later
 * Copyright (C) 2020-2026 Fluxer Contributors
 * Copyright (C) 2026 Floodilka Contributors
 * Modified by Floodilka Contributors starting March 2026. See LICENSE and NOTICE.
 */

export type AuthSession = Readonly<{
	id: string;
	approx_last_used_at: string | null;
	client_os: string;
	client_platform: string;
	client_location: string | null;
}>;

export class AuthSessionRecord {
	readonly id: string;
	readonly approxLastUsedAt: Date | null;
	readonly clientOs: string;
	readonly clientPlatform: string;
	readonly clientLocation: string | null;

	constructor(data: AuthSession) {
		this.id = data.id;
		this.approxLastUsedAt = data.approx_last_used_at ? new Date(data.approx_last_used_at) : null;
		this.clientOs = data.client_os;
		this.clientPlatform = data.client_platform;
		this.clientLocation = data.client_location;
	}

	toJSON(): AuthSession {
		return {
			id: this.id,
			approx_last_used_at: this.approxLastUsedAt?.toISOString() ?? null,
			client_os: this.clientOs,
			client_platform: this.clientPlatform,
			client_location: this.clientLocation,
		};
	}

	equals(other: AuthSessionRecord): boolean {
		return JSON.stringify(this) === JSON.stringify(other);
	}
}
