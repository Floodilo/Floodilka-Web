/*
 * SPDX-License-Identifier: AGPL-3.0-or-later
 * Copyright (C) 2020-2026 Fluxer Contributors
 * Copyright (C) 2026 Floodilka Contributors
 * Modified by Floodilka Contributors starting March 2026. See LICENSE and NOTICE.
 */

import {BaseChannelAuthService, type ChannelAuthOptions} from '../BaseChannelAuthService';

export class ChannelAuthService extends BaseChannelAuthService {
	protected readonly options: ChannelAuthOptions = {
		errorOnMissingGuild: 'missing_permissions',
		validateNsfw: true,
		useVirtualPersonalNotes: false,
	};
}
