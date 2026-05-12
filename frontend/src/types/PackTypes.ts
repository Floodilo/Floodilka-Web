/*
 * SPDX-License-Identifier: AGPL-3.0-or-later
 * Copyright (C) 2020-2026 Fluxer Contributors
 * Copyright (C) 2026 Floodilka Contributors
 * Modified by Floodilka Contributors starting March 2026. See LICENSE and NOTICE.
 */

export interface PackSummary {
	id: string;
	name: string;
	description: string | null;
	type: 'emoji' | 'sticker';
	creator_id: string;
	created_at: string;
	updated_at: string;
	installed_at?: string;
}

export interface PackDashboardSection {
	installed_limit: number;
	created_limit: number;
	installed: Array<PackSummary>;
	created: Array<PackSummary>;
}

export interface PackDashboardResponse {
	emoji: PackDashboardSection;
	sticker: PackDashboardSection;
}

export interface PackInviteMetadata {
	code: string;
	type: 'emoji_pack' | 'sticker_pack';
	pack: PackSummary & {creator: {id: string; username: string}};
	inviter: {id: string; username: string} | null;
	expires_at: string | null;
	temporary: boolean;
	created_at: string;
	uses: number;
	max_uses: number;
}
