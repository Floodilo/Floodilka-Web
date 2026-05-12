/*
 * SPDX-License-Identifier: AGPL-3.0-or-later
 * Copyright (C) 2020-2026 Fluxer Contributors
 * Copyright (C) 2026 Floodilka Contributors
 * Modified by Floodilka Contributors starting March 2026. See LICENSE and NOTICE.
 */

import {Int64Type, z} from '~/Schema';

export const TriggerUserArchiveRequest = z.object({
	user_id: Int64Type,
});

export type TriggerUserArchiveRequest = z.infer<typeof TriggerUserArchiveRequest>;

export const TriggerGuildArchiveRequest = z.object({
	guild_id: Int64Type,
});

export type TriggerGuildArchiveRequest = z.infer<typeof TriggerGuildArchiveRequest>;

export const ListArchivesRequest = z.object({
	subject_type: z.enum(['user', 'guild', 'all']).default('all'),
	subject_id: Int64Type.optional(),
	requested_by: Int64Type.optional(),
	limit: z.number().min(1).max(200).default(50),
	include_expired: z.boolean().default(false),
});

export type ListArchivesRequest = z.infer<typeof ListArchivesRequest>;
