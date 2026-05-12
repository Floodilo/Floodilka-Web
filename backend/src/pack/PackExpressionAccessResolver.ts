/*
 * SPDX-License-Identifier: AGPL-3.0-or-later
 * Copyright (C) 2020-2026 Fluxer Contributors
 * Copyright (C) 2026 Floodilka Contributors
 * Modified by Floodilka Contributors starting March 2026. See LICENSE and NOTICE.
 */

import type {GuildID, UserID} from '~/BrandedTypes';
import type {PackType} from './PackRepository';

export type PackExpressionAccessResolution = 'accessible' | 'not-accessible' | 'not-pack';

export interface PackExpressionAccessResolver {
	resolve(packId: GuildID): Promise<PackExpressionAccessResolution>;
}

export interface PackExpressionAccessResolverParams {
	userId: UserID | null;
	type: PackType;
}
