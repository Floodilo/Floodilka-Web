/*
 * SPDX-License-Identifier: AGPL-3.0-or-later
 * Copyright (C) 2020-2026 Fluxer Contributors
 * Copyright (C) 2026 Floodilka Contributors
 * Modified by Floodilka Contributors starting March 2026. See LICENSE and NOTICE.
 */

import {reaction} from 'mobx';
import {useEffect, useState} from 'react';
import type {CustomStatus} from '~/lib/customStatus';
import MemberSidebarStore from '~/stores/MemberSidebarStore';

interface UseMemberListCustomStatusOptions {
	guildId: string;
	channelId: string;
	userId: string;
	enabled?: boolean;
}

export function useMemberListCustomStatus({
	guildId,
	channelId,
	userId,
	enabled = true,
}: UseMemberListCustomStatusOptions): CustomStatus | null | undefined {
	const [customStatus, setCustomStatus] = useState<CustomStatus | null | undefined>(() => {
		if (!enabled) {
			return undefined;
		}
		return MemberSidebarStore.getCustomStatus(guildId, channelId, userId);
	});

	useEffect(() => {
		if (!enabled) {
			setCustomStatus(undefined);
			return;
		}

		const dispose = reaction(
			() => MemberSidebarStore.getCustomStatus(guildId, channelId, userId),
			(memberListCustomStatus) => {
				setCustomStatus(memberListCustomStatus);
			},
			{fireImmediately: true},
		);

		return () => {
			dispose();
		};
	}, [guildId, channelId, userId, enabled]);

	return customStatus;
}
