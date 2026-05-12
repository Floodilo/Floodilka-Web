/*
 * SPDX-License-Identifier: AGPL-3.0-or-later
 * Copyright (C) 2020-2026 Fluxer Contributors
 * Copyright (C) 2026 Floodilka Contributors
 * Modified by Floodilka Contributors starting March 2026. See LICENSE and NOTICE.
 */

import type {GuildReadyData} from '~/records/GuildRecord';
import type {GatewayHandlerContext} from '../index';
import {handleGuildCreate} from './guildCreate';

export function handleGuildSync(data: GuildReadyData, context: GatewayHandlerContext): void {
	const syncContext = {...context, _isSync: true};
	handleGuildCreate(data, syncContext);
}
