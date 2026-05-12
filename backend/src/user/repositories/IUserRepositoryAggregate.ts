/*
 * SPDX-License-Identifier: AGPL-3.0-or-later
 * Copyright (C) 2020-2026 Fluxer Contributors
 * Copyright (C) 2026 Floodilka Contributors
 * Modified by Floodilka Contributors starting March 2026. See LICENSE and NOTICE.
 */

import type {IUserAccountRepository} from './IUserAccountRepository';
import type {IUserAuthRepository} from './IUserAuthRepository';
import type {IUserChannelRepository} from './IUserChannelRepository';
import type {IUserContentRepository} from './IUserContentRepository';
import type {IUserRelationshipRepository} from './IUserRelationshipRepository';
import type {IUserSettingsRepository} from './IUserSettingsRepository';

export interface IUserRepositoryAggregate
	extends IUserAccountRepository,
		IUserAuthRepository,
		IUserSettingsRepository,
		IUserRelationshipRepository,
		IUserChannelRepository,
		IUserContentRepository {}
