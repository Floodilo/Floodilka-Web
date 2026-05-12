/*
 * SPDX-License-Identifier: AGPL-3.0-or-later
 * Copyright (C) 2020-2026 Fluxer Contributors
 * Copyright (C) 2026 Floodilka Contributors
 * Modified by Floodilka Contributors starting March 2026. See LICENSE and NOTICE.
 */

import {Trans} from '@lingui/react/macro';
import {PushPinIcon} from '@phosphor-icons/react';
import {observer} from 'mobx-react-lite';
import React from 'react';
import {SystemMessage} from '~/components/channel/SystemMessage';
import {SystemMessageUsername} from '~/components/channel/SystemMessageUsername';
import {useSystemMessageData} from '~/hooks/useSystemMessageData';
import {ComponentDispatch} from '~/lib/ComponentDispatch';
import type {MessageRecord} from '~/records/MessageRecord';
import MobileLayoutStore from '~/stores/MobileLayoutStore';
import styles from '~/styles/Message.module.css';
import {goToMessage} from '~/utils/MessageNavigator';

export const PinSystemMessage = observer(({message}: {message: MessageRecord}) => {
	const {author, channel, guild} = useSystemMessageData(message);
	const mobileLayout = MobileLayoutStore;

	const jumpToMessage = React.useCallback(() => {
		if (message.messageReference?.message_id) {
			goToMessage(message.channelId, message.messageReference.message_id);
		}
	}, [message.channelId, message.messageReference?.message_id]);

	const openPins = React.useCallback(() => {
		if (mobileLayout.enabled) {
			ComponentDispatch.dispatch('CHANNEL_DETAILS_OPEN', {
				initialTab: 'pins',
			});
		} else {
			ComponentDispatch.dispatch('CHANNEL_PINS_OPEN');
		}
	}, [mobileLayout.enabled]);

	if (!channel) {
		return null;
	}

	const messageContent = (
		<Trans>
			<SystemMessageUsername key={author.id} author={author} guild={guild} message={message} /> pinned{' '}
			<button key={`pin-${message.id}`} type="button" className={styles.systemMessageLink} onClick={jumpToMessage}>
				a message
			</button>{' '}
			to this channel. See{' '}
			<button key={`pin-all-${message.id}`} type="button" className={styles.systemMessageLink} onClick={openPins}>
				all pinned messages
			</button>
			.
		</Trans>
	);

	return <SystemMessage icon={PushPinIcon} iconWeight="fill" message={message} messageContent={messageContent} />;
});
