/*
 * SPDX-License-Identifier: AGPL-3.0-or-later
 * Copyright (C) 2020-2026 Fluxer Contributors
 * Copyright (C) 2026 Floodilka Contributors
 * Modified by Floodilka Contributors starting March 2026. See LICENSE and NOTICE.
 */

export interface AuditLogChange<K extends string = string, D = unknown> {
	key: K;
	old_value?: D;
	new_value?: D;
}

export type GuildAuditLogChange = Array<AuditLogChange>;
