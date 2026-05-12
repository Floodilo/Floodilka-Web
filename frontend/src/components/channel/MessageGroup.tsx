/*
 * SPDX-License-Identifier: AGPL-3.0-or-later
 * Copyright (C) 2020-2026 Fluxer Contributors
 * Copyright (C) 2026 Floodilka Contributors
 * Modified by Floodilka Contributors starting March 2026. See LICENSE and NOTICE.
 */

import {observer} from 'mobx-react-lite';
import type React from 'react';
import {Fragment} from 'react';
import type {ChannelRecord} from '~/records/ChannelRecord';
import type {MessageRecord} from '~/records/MessageRecord';
import {Message} from './Message';
import {UnreadDividerSlot} from './UnreadDividerSlot';

interface MessageGroupProps {
	messages: Array<MessageRecord>;
	channel: ChannelRecord;
	onEdit?: (targetNode: HTMLElement) => void;
	jumpSequenceId?: number;
	highlightedMessageId?: string | null;
	messageDisplayCompact?: boolean;
	flashKey?: number;
	getUnreadDividerVisibility?: (messageId: string, position: 'before' | 'after') => boolean;
	idPrefix?: string;
}

export const MessageGroup: React.FC<MessageGroupProps> = observer((props) => {
	const {
		messages,
		channel,
		onEdit,
		jumpSequenceId,
		highlightedMessageId,
		messageDisplayCompact = false,
		getUnreadDividerVisibility,
		idPrefix,
	} = props;

	const groupId = messages[0]?.id;

	return (
		<div data-jump-sequence-id={jumpSequenceId} data-group-id={groupId} role="group" aria-label="Message group">
			{messages.map((message, index) => {
				const prevMessage = messages[index - 1];
				const isGroupStart = index === 0;

				return (
					<Fragment key={message.id}>
						{getUnreadDividerVisibility && (
							<UnreadDividerSlot beforeId={message.id} visible={getUnreadDividerVisibility(message.id, 'before')} />
						)}

						<div data-message-index={index} data-message-id={message.id} data-is-group-start={isGroupStart}>
							<Message
								channel={channel}
								message={message}
								prevMessage={prevMessage}
								onEdit={onEdit}
								shouldGroup={!isGroupStart}
								isJumpTarget={highlightedMessageId === message.id}
								compact={messageDisplayCompact}
								idPrefix={idPrefix}
							/>
						</div>
					</Fragment>
				);
			})}
		</div>
	);
});
