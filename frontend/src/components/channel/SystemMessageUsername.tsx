/*
 * SPDX-License-Identifier: AGPL-3.0-or-later
 * Copyright (C) 2020-2026 Fluxer Contributors
 * Copyright (C) 2026 Floodilka Contributors
 * Modified by Floodilka Contributors starting March 2026. See LICENSE and NOTICE.
 */

import React from 'react';
import {PreloadableUserPopout} from '~/components/channel/PreloadableUserPopout';
import type {GuildRecord} from '~/records/GuildRecord';
import type {MessageRecord} from '~/records/MessageRecord';
import type {UserRecord} from '~/records/UserRecord';
import GuildMemberStore from '~/stores/GuildMemberStore';
import styles from '~/styles/Message.module.css';
import * as NicknameUtils from '~/utils/NicknameUtils';

export const SystemMessageUsername = React.forwardRef<
	HTMLElement,
	{
		author: UserRecord;
		guild?: GuildRecord;
		message: MessageRecord;
	}
>(({author, guild, message}, ref) => {
	const member = GuildMemberStore.getMember(guild?.id ?? '', author.id);
	return (
		<PreloadableUserPopout ref={ref} user={author} isWebhook={false} guildId={guild?.id} channelId={message.channelId}>
			<span
				className={styles.systemMessageLink}
				style={{color: member?.getColorString()}}
				data-user-id={author.id}
				data-guild-id={guild?.id}
			>
				{NicknameUtils.getNickname(author, guild?.id)}
			</span>
		</PreloadableUserPopout>
	);
});
