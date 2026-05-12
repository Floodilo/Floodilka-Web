/*
 * SPDX-License-Identifier: AGPL-3.0-or-later
 * Copyright (C) 2020-2026 Fluxer Contributors
 * Copyright (C) 2026 Floodilka Contributors
 * Modified by Floodilka Contributors starting March 2026. See LICENSE and NOTICE.
 */

export interface GuildRole {
	readonly id: string;
	readonly name: string;
	readonly color: number;
	readonly position: number;
	readonly hoist_position?: number | null;
	readonly permissions: string;
	readonly hoist: boolean;
	readonly mentionable: boolean;
}

export class GuildRoleRecord {
	readonly id: string;
	readonly guildId: string;
	readonly name: string;
	readonly color: number;
	readonly position: number;
	readonly hoistPosition: number | null;
	readonly permissions: bigint;
	readonly hoist: boolean;
	readonly mentionable: boolean;

	constructor(guildId: string, guildRole: GuildRole) {
		this.id = guildRole.id;
		this.guildId = guildId;
		this.name = guildRole.name;
		this.color = guildRole.color;
		this.position = guildRole.position;
		this.hoistPosition = guildRole.hoist_position ?? null;
		this.permissions = BigInt(guildRole.permissions);
		this.hoist = guildRole.hoist;
		this.mentionable = guildRole.mentionable;
	}

	get effectiveHoistPosition(): number {
		return this.hoistPosition ?? this.position;
	}

	withUpdates(updates: Partial<GuildRole>): GuildRoleRecord {
		return new GuildRoleRecord(this.guildId, {
			id: this.id,
			name: updates.name ?? this.name,
			color: updates.color ?? this.color,
			position: updates.position ?? this.position,
			hoist_position: updates.hoist_position !== undefined ? updates.hoist_position : this.hoistPosition,
			permissions: updates.permissions ?? this.permissions.toString(),
			hoist: updates.hoist ?? this.hoist,
			mentionable: updates.mentionable ?? this.mentionable,
		});
	}

	get isEveryone(): boolean {
		return this.id === this.guildId;
	}

	equals(other: GuildRoleRecord): boolean {
		return (
			this.id === other.id &&
			this.guildId === other.guildId &&
			this.name === other.name &&
			this.color === other.color &&
			this.position === other.position &&
			this.hoistPosition === other.hoistPosition &&
			this.permissions === other.permissions &&
			this.hoist === other.hoist &&
			this.mentionable === other.mentionable
		);
	}

	toJSON(): GuildRole {
		return {
			id: this.id,
			name: this.name,
			color: this.color,
			position: this.position,
			hoist_position: this.hoistPosition,
			permissions: this.permissions.toString(),
			hoist: this.hoist,
			mentionable: this.mentionable,
		};
	}
}
