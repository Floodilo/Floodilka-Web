/*
 * SPDX-License-Identifier: AGPL-3.0-or-later
 * Copyright (C) 2020-2026 Fluxer Contributors
 * Copyright (C) 2026 Floodilka Contributors
 * Modified by Floodilka Contributors starting March 2026. See LICENSE and NOTICE.
 */

import {useEffect} from 'react';
import {ComponentDispatch} from '~/lib/ComponentDispatch';

export function useChannelMemberListVisibility(channelId: string | undefined, visible: boolean): void {
	useEffect(() => {
		if (!channelId) return;
		ComponentDispatch.dispatch('LAYOUT_RESIZED', {channelId});
	}, [channelId, visible]);
}
