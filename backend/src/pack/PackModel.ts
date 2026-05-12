/*
 * SPDX-License-Identifier: AGPL-3.0-or-later
 * Copyright (C) 2020-2026 Fluxer Contributors
 * Copyright (C) 2026 Floodilka Contributors
 * Modified by Floodilka Contributors starting March 2026. See LICENSE and NOTICE.
 */

import type {ExpressionPack} from '~/models/ExpressionPack';
import type {PackType} from './PackRepository';

export interface PackSummary {
	id: string;
	name: string;
	description: string | null;
	type: PackType;
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

export const mapPackToSummary = (pack: ExpressionPack, installedAt?: Date | null): PackSummary => {
	const summary: PackSummary = {
		id: pack.id.toString(),
		name: pack.name,
		description: pack.description,
		type: pack.type,
		creator_id: pack.creatorId.toString(),
		created_at: pack.createdAt.toISOString(),
		updated_at: pack.updatedAt.toISOString(),
	};
	if (installedAt) {
		summary.installed_at = installedAt.toISOString();
	}
	return summary;
};
