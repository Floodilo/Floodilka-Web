/*
 * SPDX-License-Identifier: AGPL-3.0-or-later
 * Copyright (C) 2020-2026 Fluxer Contributors
 * Copyright (C) 2026 Floodilka Contributors
 * Modified by Floodilka Contributors starting March 2026. See LICENSE and NOTICE.
 */

import type {IGuildContentRepository} from './IGuildContentRepository';
import type {IGuildDataRepository} from './IGuildDataRepository';
import type {IGuildMemberRepository} from './IGuildMemberRepository';
import type {IGuildModerationRepository} from './IGuildModerationRepository';
import type {IGuildRoleRepository} from './IGuildRoleRepository';

export interface IGuildRepositoryAggregate
	extends IGuildDataRepository,
		IGuildMemberRepository,
		IGuildRoleRepository,
		IGuildModerationRepository,
		IGuildContentRepository {}
