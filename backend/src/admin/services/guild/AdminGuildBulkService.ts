/*
 * SPDX-License-Identifier: AGPL-3.0-or-later
 * Copyright (C) 2020-2026 Fluxer Contributors
 * Copyright (C) 2026 Floodilka Contributors
 * Modified by Floodilka Contributors starting March 2026. See LICENSE and NOTICE.
 */

import {createGuildID, type UserID} from '~/BrandedTypes';
import type {BulkUpdateGuildFeaturesRequest} from '../../AdminModel';
import type {AdminAuditService} from '../AdminAuditService';
import type {AdminGuildUpdateService} from './AdminGuildUpdateService';

interface AdminGuildBulkServiceDeps {
	guildUpdateService: AdminGuildUpdateService;
	auditService: AdminAuditService;
}

export class AdminGuildBulkService {
	constructor(private readonly deps: AdminGuildBulkServiceDeps) {}

	async bulkUpdateGuildFeatures(
		data: BulkUpdateGuildFeaturesRequest,
		adminUserId: UserID,
		auditLogReason: string | null,
	) {
		const {guildUpdateService, auditService} = this.deps;
		const successful: Array<string> = [];
		const failed: Array<{id: string; error: string}> = [];

		for (const guildIdBigInt of data.guild_ids) {
			try {
				const guildId = createGuildID(guildIdBigInt);
				await guildUpdateService.updateGuildFeatures({
					guildId,
					addFeatures: data.add_features,
					removeFeatures: data.remove_features,
					adminUserId,
					auditLogReason: null,
				});
				successful.push(guildId.toString());
			} catch (error) {
				failed.push({
					id: guildIdBigInt.toString(),
					error: error instanceof Error ? error.message : 'Unknown error',
				});
			}
		}

		await auditService.createAuditLog({
			adminUserId,
			targetType: 'guild',
			targetId: BigInt(0),
			action: 'bulk_update_guild_features',
			auditLogReason,
			metadata: new Map([
				['guild_count', data.guild_ids.length.toString()],
				['add_features', data.add_features.join(',')],
				['remove_features', data.remove_features.join(',')],
			]),
		});

		return {
			successful,
			failed,
		};
	}
}
