/*
 * SPDX-License-Identifier: AGPL-3.0-or-later
 * Copyright (C) 2020-2026 Fluxer Contributors
 * Copyright (C) 2026 Floodilka Contributors
 * Modified by Floodilka Contributors starting March 2026. See LICENSE and NOTICE.
 */

import {observer} from 'mobx-react-lite';
import {PreloadableUserPopout} from '~/components/channel/PreloadableUserPopout';
import FocusRing from '~/components/uikit/FocusRing/FocusRing';
import type {GuildMemberRecord} from '~/records/GuildMemberRecord';
import type {GuildRecord} from '~/records/GuildRecord';
import type {MessageRecord} from '~/records/MessageRecord';
import type {UserRecord} from '~/records/UserRecord';
import KeyboardModeStore from '~/stores/KeyboardModeStore';
import * as NicknameUtils from '~/utils/NicknameUtils';

export const MessageUsername = observer(
	({
		user,
		message,
		guild,
		member,
		className,
		previewColor,
		previewName,
	}: {
		user: UserRecord;
		message: MessageRecord;
		guild?: GuildRecord;
		member?: GuildMemberRecord;
		className: string;
		isPreview: boolean;
		previewColor?: string;
		previewName?: string;
	}) => {
		const displayName = previewName || NicknameUtils.getNickname(user, guild?.id, message.channelId);
		const color = previewColor || member?.getColorString();

		return (
			<PreloadableUserPopout
				user={user}
				isWebhook={message.webhookId != null}
				guildId={guild?.id}
				channelId={message.channelId}
				enableLongPressActions={false}
			>
				<FocusRing>
					<span
						className={className}
						style={{color}}
						data-user-id={user.id}
						data-guild-id={guild?.id}
						tabIndex={KeyboardModeStore.keyboardModeEnabled ? 0 : -1}
						role="button"
						onKeyDown={(e) => {
							if (e.key === 'Enter' || e.key === ' ') {
								e.preventDefault();
								e.currentTarget.click();
							}
						}}
					>
						{displayName}
					</span>
				</FocusRing>
			</PreloadableUserPopout>
		);
	},
);
