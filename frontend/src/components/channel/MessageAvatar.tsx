/*
 * SPDX-License-Identifier: AGPL-3.0-or-later
 * Copyright (C) 2020-2026 Fluxer Contributors
 * Copyright (C) 2026 Floodilka Contributors
 * Modified by Floodilka Contributors starting March 2026. See LICENSE and NOTICE.
 */

import {observer} from 'mobx-react-lite';
import {PreloadableUserPopout} from '~/components/channel/PreloadableUserPopout';
import {Avatar} from '~/components/uikit/Avatar';
import FocusRing from '~/components/uikit/FocusRing/FocusRing';
import type {MessageRecord} from '~/records/MessageRecord';
import type {UserRecord} from '~/records/UserRecord';

export const MessageAvatar = observer(
	({
		user,
		message,
		guildId,
		size,
		className,
		isHovering,
	}: {
		user: UserRecord;
		message: MessageRecord;
		guildId?: string;
		size: 16 | 24 | 32 | 40 | 48 | 80 | 120;
		className: string;
		isHovering: boolean;
		isPreview: boolean;
	}) => {
		return (
			<PreloadableUserPopout
				user={user}
				isWebhook={message.webhookId != null}
				guildId={guildId}
				channelId={message.channelId}
				enableLongPressActions={false}
			>
				<FocusRing>
					<Avatar
						user={user}
						size={size}
						className={className}
						forceAnimate={isHovering}
						guildId={guildId}
						data-user-id={user.id}
						data-guild-id={guildId}
					/>
				</FocusRing>
			</PreloadableUserPopout>
		);
	},
);
