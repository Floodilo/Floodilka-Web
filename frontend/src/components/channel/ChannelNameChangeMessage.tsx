/*
 * SPDX-License-Identifier: AGPL-3.0-or-later
 * Copyright (C) 2020-2026 Fluxer Contributors
 * Copyright (C) 2026 Floodilka Contributors
 * Modified by Floodilka Contributors starting March 2026. See LICENSE and NOTICE.
 */

import {Trans} from '@lingui/react/macro';
import {PencilSimpleIcon} from '@phosphor-icons/react';
import {observer} from 'mobx-react-lite';
import {SystemMessage} from '~/components/channel/SystemMessage';
import {SystemMessageUsername} from '~/components/channel/SystemMessageUsername';
import {useSystemMessageData} from '~/hooks/useSystemMessageData';
import type {MessageRecord} from '~/records/MessageRecord';
import styles from '~/styles/Message.module.css';

export const ChannelNameChangeMessage = observer(({message}: {message: MessageRecord}) => {
	const {author, channel, guild} = useSystemMessageData(message);

	if (!channel) {
		return null;
	}

	const newName = message.content;
	const nameComponent = channel.isGroupDM() ? (
		<span className={styles.systemMessageLink} style={{cursor: 'text', textDecoration: 'none'}}>
			{newName}
		</span>
	) : (
		<span className={styles.systemMessageLink}>{newName}</span>
	);

	const messageContent = newName ? (
		<Trans>
			<SystemMessageUsername key={author.id} author={author} guild={guild} message={message} /> changed the channel name
			to {nameComponent}.
		</Trans>
	) : (
		<Trans>
			<SystemMessageUsername key={author.id} author={author} guild={guild} message={message} /> changed the channel
			name.
		</Trans>
	);

	return <SystemMessage icon={PencilSimpleIcon} iconWeight="bold" message={message} messageContent={messageContent} />;
});
