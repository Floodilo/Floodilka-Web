/*
 * SPDX-License-Identifier: AGPL-3.0-or-later
 * Copyright (C) 2020-2026 Fluxer Contributors
 * Copyright (C) 2026 Floodilka Contributors
 * Modified by Floodilka Contributors starting March 2026. See LICENSE and NOTICE.
 */

import {reaction} from 'mobx';
import {useEffect, useState} from 'react';
import type {StatusType} from '~/Constants';
import MemberSidebarStore from '~/stores/MemberSidebarStore';
import PresenceStore from '~/stores/PresenceStore';

interface UseMemberListPresenceOptions {
	guildId: string;
	channelId: string;
	userId: string;
	enabled?: boolean;
}

export function useMemberListPresence({
	guildId,
	channelId,
	userId,
	enabled = true,
}: UseMemberListPresenceOptions): StatusType {
	const [status, setStatus] = useState(() => {
		const memberListPresence = enabled ? MemberSidebarStore.getPresence(guildId, channelId, userId) : null;
		return memberListPresence ?? PresenceStore.getStatus(userId);
	});

	useEffect(() => {
		let disposeMemberListReaction: (() => void) | undefined;

		if (enabled) {
			disposeMemberListReaction = reaction(
				() => MemberSidebarStore.getPresence(guildId, channelId, userId),
				(memberListPresence) => {
					if (memberListPresence !== null) {
						setStatus(memberListPresence);
					} else {
						setStatus(PresenceStore.getStatus(userId));
					}
				},
				{fireImmediately: true},
			);
		} else {
			setStatus(PresenceStore.getStatus(userId));
		}

		const unsubscribePresence = PresenceStore.subscribeToUserStatus(userId, (_userId, newStatus) => {
			if (!enabled) {
				setStatus(newStatus);
				return;
			}
			setStatus(() => {
				const memberListPresence = MemberSidebarStore.getPresence(guildId, channelId, userId);
				return memberListPresence ?? newStatus;
			});
		});

		return () => {
			unsubscribePresence();
			disposeMemberListReaction?.();
		};
	}, [guildId, channelId, userId, enabled]);

	return status;
}
