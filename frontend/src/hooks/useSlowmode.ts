/*
 * SPDX-License-Identifier: AGPL-3.0-or-later
 * Copyright (C) 2020-2026 Fluxer Contributors
 * Copyright (C) 2026 Floodilka Contributors
 * Modified by Floodilka Contributors starting March 2026. See LICENSE and NOTICE.
 */

import {useEffect, useState} from 'react';
import {Permissions} from '~/Constants';
import type {ChannelRecord} from '~/records/ChannelRecord';
import DeveloperOptionsStore from '~/stores/DeveloperOptionsStore';
import PermissionStore from '~/stores/PermissionStore';
import SlowmodeStore from '~/stores/SlowmodeStore';
import UserStore from '~/stores/UserStore';

interface SlowmodeState {
	isSlowmodeActive: boolean;
	slowmodeRemaining: number;
	canBypass: boolean;
}

export function useSlowmode(channel: ChannelRecord): SlowmodeState {
	const [slowmodeRemaining, setSlowmodeRemaining] = useState(0);
	const currentUser = UserStore.getCurrentUser();
	const lastSendTimestamp = SlowmodeStore.getLastSendTimestamp(channel.id);
	const mockSlowmodeActive = DeveloperOptionsStore.mockSlowmodeActive;
	const mockSlowmodeRemaining = DeveloperOptionsStore.mockSlowmodeRemaining;

	const canBypass = channel.guildId ? PermissionStore.can(Permissions.BYPASS_SLOWMODE, channel) : true;

	const rateLimitPerUser = channel.rateLimitPerUser || 0;

	useEffect(() => {
		if (mockSlowmodeActive) {
			setSlowmodeRemaining(mockSlowmodeRemaining);
			return;
		}

		if (!currentUser || !channel.guildId || !rateLimitPerUser || canBypass) {
			setSlowmodeRemaining(0);
			return;
		}

		const updateSlowmode = () => {
			if (!lastSendTimestamp) {
				setSlowmodeRemaining(0);
				return;
			}

			const timeSinceLastMessage = Date.now() - lastSendTimestamp;
			const remaining = Math.max(0, rateLimitPerUser * 1000 - timeSinceLastMessage);

			setSlowmodeRemaining(remaining);
		};

		updateSlowmode();
	}, [
		channel.guildId,
		currentUser,
		rateLimitPerUser,
		canBypass,
		lastSendTimestamp,
		mockSlowmodeActive,
		mockSlowmodeRemaining,
	]);

	useEffect(() => {
		if (mockSlowmodeActive) return;
		if (slowmodeRemaining <= 0) return;

		const interval = setInterval(() => {
			setSlowmodeRemaining((prev) => {
				const next = prev - 1000;
				return next > 0 ? next : 0;
			});
		}, 1000);

		return () => clearInterval(interval);
	}, [slowmodeRemaining, mockSlowmodeActive]);

	const isSlowmodeActive = mockSlowmodeActive || (!canBypass && rateLimitPerUser > 0 && slowmodeRemaining > 0);

	return {
		isSlowmodeActive,
		slowmodeRemaining,
		canBypass,
	};
}
