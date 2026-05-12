/*
 * SPDX-License-Identifier: AGPL-3.0-or-later
 * Copyright (C) 2020-2026 Fluxer Contributors
 * Copyright (C) 2026 Floodilka Contributors
 * Modified by Floodilka Contributors starting March 2026. See LICENSE and NOTICE.
 */

import {useLingui} from '@lingui/react/macro';
import React from 'react';
import {getStatusTypeLabel} from '~/Constants';
import {BaseAvatar} from '~/components/uikit/BaseAvatar';
import {cdnUrl} from '~/utils/UrlUtils';

interface MockAvatarProps {
	size: 12 | 16 | 20 | 24 | 32 | 36 | 40 | 48 | 56 | 80 | 120;
	avatarUrl?: string;
	hoverAvatarUrl?: string;
	status?: string | null;
	isTyping?: boolean;
	showOffline?: boolean;
	className?: string;
	isClickable?: boolean;
	userTag?: string;
	disableStatusTooltip?: boolean;
	shouldPlayAnimated?: boolean;
	isMobileStatus?: boolean;
}

export const MockAvatar = React.forwardRef<HTMLDivElement, MockAvatarProps>(
	(
		{
			size,
			avatarUrl = 'https://static.floodilka.com/avatars/0.png',
			hoverAvatarUrl,
			status,
			isTyping = false,
			showOffline = true,
			className,
			isClickable = false,
			userTag = 'Mock User',
			disableStatusTooltip = false,
			shouldPlayAnimated = false,
			isMobileStatus = false,
			...props
		},
		ref,
	) => {
		const {i18n} = useLingui();
		const statusLabel = status != null ? getStatusTypeLabel(i18n, status) : null;

		return (
			<BaseAvatar
				ref={ref}
				size={size}
				avatarUrl={avatarUrl}
				hoverAvatarUrl={hoverAvatarUrl}
				status={status}
				shouldPlayAnimated={shouldPlayAnimated}
				isTyping={isTyping}
				showOffline={showOffline}
				className={className}
				isClickable={isClickable}
				userTag={userTag}
				statusLabel={statusLabel}
				disableStatusTooltip={disableStatusTooltip}
				isMobileStatus={isMobileStatus}
				{...props}
			/>
		);
	},
);

MockAvatar.displayName = 'MockAvatar';
