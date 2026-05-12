/*
 * SPDX-License-Identifier: AGPL-3.0-or-later
 * Copyright (C) 2020-2026 Fluxer Contributors
 * Copyright (C) 2026 Floodilka Contributors
 * Modified by Floodilka Contributors starting March 2026. See LICENSE and NOTICE.
 */

import {observer} from 'mobx-react-lite';
import type React from 'react';
import {useEffect, useState} from 'react';
import {Avatar} from '~/components/uikit/Avatar';
import type {UserRecord} from '~/records/UserRecord';
import PresenceStore from '~/stores/PresenceStore';

interface StatusAwareAvatarProps {
	user: UserRecord | null;
	size: 16 | 24 | 28 | 32 | 36 | 40 | 48 | 56 | 64 | 80 | 120;
	forceAnimate?: boolean;
	isTyping?: boolean;
	showOffline?: boolean;
	className?: string;
	isClickable?: boolean;
	disablePresence?: boolean;
	disableStatusTooltip?: boolean;
	avatarUrl?: string | null;
	hoverAvatarUrl?: string | null;
	guildId?: string | null;
	status?: string | null;
}

export const StatusAwareAvatar: React.FC<StatusAwareAvatarProps> = observer(
	({
		user,
		size,
		forceAnimate,
		isTyping,
		showOffline,
		className,
		isClickable,
		disablePresence,
		disableStatusTooltip = false,
		avatarUrl,
		hoverAvatarUrl,
		guildId,
		status: externalStatus,
	}) => {
		const [internalStatus, setInternalStatus] = useState<string | null>(() =>
			disablePresence || !user ? null : PresenceStore.getStatus(user.id),
		);
		const [isMobile, setIsMobile] = useState<boolean>(() =>
			disablePresence || !user ? false : PresenceStore.isMobile(user.id),
		);

		const status = externalStatus ?? internalStatus;

		useEffect(() => {
			if (disablePresence || !user || externalStatus !== undefined) {
				return;
			}

			setInternalStatus(PresenceStore.getStatus(user.id));
			setIsMobile(PresenceStore.isMobile(user.id));

			const unsubscribe = PresenceStore.subscribeToUserStatus(user.id, (_, newStatus, newIsMobile) => {
				setInternalStatus(newStatus);
				setIsMobile(newIsMobile);
			});

			return () => {
				unsubscribe();
			};
		}, [user?.id, disablePresence, user, externalStatus]);

		if (!user) {
			return null;
		}

		return (
			<Avatar
				user={user}
				size={size}
				status={disablePresence ? null : status}
				isMobileStatus={disablePresence ? false : isMobile}
				forceAnimate={forceAnimate}
				isTyping={isTyping}
				showOffline={showOffline}
				className={className}
				isClickable={isClickable}
				disableStatusTooltip={disableStatusTooltip}
				avatarUrl={avatarUrl}
				hoverAvatarUrl={hoverAvatarUrl}
				guildId={guildId}
			/>
		);
	},
);
