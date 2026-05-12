/*
 * SPDX-License-Identifier: AGPL-3.0-or-later
 * Copyright (C) 2020-2026 Fluxer Contributors
 * Copyright (C) 2026 Floodilka Contributors
 * Modified by Floodilka Contributors starting March 2026. See LICENSE and NOTICE.
 */

import {clsx} from 'clsx';
import {observer} from 'mobx-react-lite';
import type React from 'react';
import {SlowmodeIndicator} from '~/components/channel/SlowmodeIndicator';
import {useSlowmode} from '~/hooks/useSlowmode';
import type {ChannelRecord} from '~/records/ChannelRecord';
import MessageEditMobileStore from '~/stores/MessageEditMobileStore';
import MessageReplyStore from '~/stores/MessageReplyStore';
import MessageStore from '~/stores/MessageStore';
import MobileLayoutStore from '~/stores/MobileLayoutStore';
import styles from './ChannelChatLayout.module.css';
import {TypingUsers} from './TypingUsers';

interface ChannelChatLayoutProps {
	channel: ChannelRecord;
	messages: React.ReactNode;
	textarea: React.ReactNode;
}

export const ChannelChatLayout = observer(({channel, messages, textarea}: ChannelChatLayoutProps) => {
	const {isSlowmodeActive, slowmodeRemaining} = useSlowmode(channel);
	const hasSlowmodeIndicator = isSlowmodeActive && slowmodeRemaining > 0;

	const replyingMessage = MessageReplyStore.getReplyingMessage(channel.id);
	const referencedMessage = replyingMessage ? MessageStore.getMessage(channel.id, replyingMessage.messageId) : null;
	const editingMobileMessageId = MessageEditMobileStore.getEditingMobileMessageId(channel.id);
	const editingMessage = editingMobileMessageId ? MessageStore.getMessage(channel.id, editingMobileMessageId) : null;
	const hasTopBar = Boolean(referencedMessage || (editingMessage && MobileLayoutStore.enabled));

	return (
		<div className={styles.container}>
			<div className={styles.messagesArea}>{messages}</div>
			<div className={clsx(styles.typingArea, hasTopBar && styles.typingAreaWithTopBar)}>
				<div className={styles.typingContent}>
					<div className={styles.typingLeft}>
						<TypingUsers channel={channel} />
					</div>
					{hasSlowmodeIndicator && (
						<div className={styles.typingRight}>
							<SlowmodeIndicator slowmodeRemaining={slowmodeRemaining} />
						</div>
					)}
				</div>
			</div>
			<div className={styles.textareaArea}>{textarea}</div>
		</div>
	);
});
