/*
 * SPDX-License-Identifier: AGPL-3.0-or-later
 * Copyright (C) 2020-2026 Fluxer Contributors
 * Copyright (C) 2026 Floodilka Contributors
 * Modified by Floodilka Contributors starting March 2026. See LICENSE and NOTICE.
 */

import type {GuildFeatures} from '~/Constants';

export interface GuildLike {
	id: string;
	name: string;
	icon: string | null;
	banner: string | null;
	splash: string | null;
	embedSplash?: string | null;
	features: Set<(typeof GuildFeatures)[keyof typeof GuildFeatures]>;
}

export interface ChannelLike {
	id: string;
	name?: string | null;
}
