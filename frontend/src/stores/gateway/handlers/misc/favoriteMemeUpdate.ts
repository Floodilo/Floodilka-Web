/*
 * SPDX-License-Identifier: AGPL-3.0-or-later
 * Copyright (C) 2020-2026 Fluxer Contributors
 * Copyright (C) 2026 Floodilka Contributors
 * Modified by Floodilka Contributors starting March 2026. See LICENSE and NOTICE.
 */

import type {FavoriteMeme} from '~/records/FavoriteMemeRecord';
import FavoriteMemeStore from '~/stores/FavoriteMemeStore';
import type {GatewayHandlerContext} from '../index';

interface FavoriteMemePayload {
	id: string;
	url: string;
}

export function handleFavoriteMemeUpdate(data: FavoriteMemePayload, _context: GatewayHandlerContext): void {
	FavoriteMemeStore.updateMeme(data as FavoriteMeme);
}
