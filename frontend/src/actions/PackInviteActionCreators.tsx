/*
 * SPDX-License-Identifier: AGPL-3.0-or-later
 * Copyright (C) 2020-2026 Fluxer Contributors
 * Copyright (C) 2026 Floodilka Contributors
 * Modified by Floodilka Contributors starting March 2026. See LICENSE and NOTICE.
 */

import {Endpoints} from '~/Endpoints';
import http from '~/lib/HttpClient';
import {Logger} from '~/lib/Logger';
import type {PackInviteMetadata} from '~/types/PackTypes';

const logger = new Logger('PackInvites');

export interface CreatePackInviteParams {
	packId: string;
	maxUses?: number;
	maxAge?: number;
	unique?: boolean;
}

export const createInvite = async (params: CreatePackInviteParams): Promise<PackInviteMetadata> => {
	try {
		logger.debug(`Creating invite for pack ${params.packId}`);
		const response = await http.post<PackInviteMetadata>({
			url: Endpoints.PACK_INVITES(params.packId),
			body: {
				max_uses: params.maxUses ?? 0,
				max_age: params.maxAge ?? 0,
				unique: params.unique ?? false,
			},
		});
		return response.body;
	} catch (error) {
		logger.error(`Failed to create invite for pack ${params.packId}:`, error);
		throw error;
	}
};
