/*
 * SPDX-License-Identifier: AGPL-3.0-or-later
 * Copyright (C) 2020-2026 Fluxer Contributors
 * Copyright (C) 2026 Floodilka Contributors
 * Modified by Floodilka Contributors starting March 2026. See LICENSE and NOTICE.
 */

import {Trans} from '@lingui/react/macro';
import {UserPlusIcon} from '@phosphor-icons/react';
import {observer} from 'mobx-react-lite';
import {SystemMessage} from '~/components/channel/SystemMessage';
import {SystemMessageUsername} from '~/components/channel/SystemMessageUsername';
import {useSystemMessageData} from '~/hooks/useSystemMessageData';
import type {MessageRecord} from '~/records/MessageRecord';
import UserStore from '~/stores/UserStore';
import styles from './RecipientAddMessage.module.css';

export const RecipientAddMessage = observer(({message}: {message: MessageRecord}) => {
	const {author, channel, guild} = useSystemMessageData(message);

	const addedUserId = message.mentions.length > 0 ? message.mentions[0].id : null;
	const addedUser = UserStore.getUser(addedUserId ?? '');

	if (!channel) {
		return null;
	}

	const messageContent = addedUser ? (
		<Trans>
			<SystemMessageUsername key={author.id} author={author} guild={guild} message={message} /> added{' '}
			<SystemMessageUsername key={addedUser.id} author={addedUser} guild={guild} message={message} /> to the group.
		</Trans>
	) : (
		<Trans>
			<SystemMessageUsername key={author.id} author={author} guild={guild} message={message} /> added someone to the
			group.
		</Trans>
	);

	return (
		<SystemMessage
			icon={UserPlusIcon}
			iconWeight="bold"
			iconClassname={styles.icon}
			message={message}
			messageContent={messageContent}
		/>
	);
});
