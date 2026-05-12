/*
 * SPDX-License-Identifier: AGPL-3.0-or-later
 * Copyright (C) 2020-2026 Fluxer Contributors
 * Copyright (C) 2026 Floodilka Contributors
 * Modified by Floodilka Contributors starting March 2026. See LICENSE and NOTICE.
 */

import {useLingui} from '@lingui/react/macro';
import {ArrowRightIcon} from '@phosphor-icons/react';
import {observer} from 'mobx-react-lite';
import {SystemMessage} from '~/components/channel/SystemMessage';
import {SystemMessageUsername} from '~/components/channel/SystemMessageUsername';
import {useSystemMessageData} from '~/hooks/useSystemMessageData';
import type {MessageRecord} from '~/records/MessageRecord';
import {SystemMessageUtils} from '~/utils/SystemMessageUtils';
import styles from './GuildJoinMessage.module.css';

export const GuildJoinMessage = observer(({message}: {message: MessageRecord}) => {
	const {i18n} = useLingui();
	const {author, channel, guild} = useSystemMessageData(message);

	if (!channel) {
		return null;
	}

	const messageContent = SystemMessageUtils.getGuildJoinMessage(
		message.id,
		<SystemMessageUsername author={author} guild={guild} message={message} key={author.id} />,
		i18n,
	);
	return (
		<SystemMessage
			icon={ArrowRightIcon}
			iconWeight="bold"
			iconClassname={styles.icon}
			message={message}
			messageContent={messageContent}
		/>
	);
});
