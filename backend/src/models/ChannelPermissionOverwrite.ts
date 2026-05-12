/*
 * SPDX-License-Identifier: AGPL-3.0-or-later
 * Copyright (C) 2020-2026 Fluxer Contributors
 * Copyright (C) 2026 Floodilka Contributors
 * Modified by Floodilka Contributors starting March 2026. See LICENSE and NOTICE.
 */

import type {PermissionOverwrite} from '~/database/CassandraTypes';

export class ChannelPermissionOverwrite {
	readonly type: number;
	readonly allow: bigint;
	readonly deny: bigint;

	constructor(overwrite: PermissionOverwrite) {
		this.type = overwrite.type;
		this.allow = overwrite.allow_ ?? 0n;
		this.deny = overwrite.deny_ ?? 0n;
	}

	toPermissionOverwrite(): PermissionOverwrite {
		return {
			type: this.type,
			allow_: this.allow,
			deny_: this.deny,
		};
	}
}
