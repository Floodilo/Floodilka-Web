/*
 * SPDX-License-Identifier: AGPL-3.0-or-later
 * Copyright (C) 2020-2026 Fluxer Contributors
 * Copyright (C) 2026 Floodilka Contributors
 * Modified by Floodilka Contributors starting March 2026. See LICENSE and NOTICE.
 */

import {Trans} from '@lingui/react/macro';
import {UserMinusIcon} from '@phosphor-icons/react';
import {observer} from 'mobx-react-lite';
import {SystemMessage} from '~/components/channel/SystemMessage';
import {SystemMessageUsername} from '~/components/channel/SystemMessageUsername';
import {useSystemMessageData} from '~/hooks/useSystemMessageData';
import type {MessageRecord} from '~/records/MessageRecord';
import UserStore from '~/stores/UserStore';
import styles from './RecipientRemoveMessage.module.css';

export const RecipientRemoveMessage = observer(({message}: {message: MessageRecord}) => {
	const {author, channel, guild} = useSystemMessageData(message);

	const removedUserId = message.mentions.length > 0 ? message.mentions[0].id : null;
	const removedUser = UserStore.getUser(removedUserId ?? '');

	if (!channel) {
		return null;
	}

	const isSelfRemove = removedUserId === author.id;

	const messageContent = isSelfRemove ? (
		<Trans>
			<SystemMessageUsername key={author.id} author={author} guild={guild} message={message} /> has left the group.
		</Trans>
	) : removedUser ? (
		<Trans>
			<SystemMessageUsername key={author.id} author={author} guild={guild} message={message} /> removed{' '}
			<SystemMessageUsername key={removedUser.id} author={removedUser} guild={guild} message={message} /> from the
			group.
		</Trans>
	) : (
		<Trans>
			<SystemMessageUsername key={author.id} author={author} guild={guild} message={message} /> removed someone from the
			group.
		</Trans>
	);

	return (
		<SystemMessage
			icon={UserMinusIcon}
			iconWeight="bold"
			iconClassname={styles.icon}
			message={message}
			messageContent={messageContent}
		/>
	);
});
