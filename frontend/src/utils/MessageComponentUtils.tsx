/*
 * SPDX-License-Identifier: AGPL-3.0-or-later
 * Copyright (C) 2020-2026 Fluxer Contributors
 * Copyright (C) 2026 Floodilka Contributors
 * Modified by Floodilka Contributors starting March 2026. See LICENSE and NOTICE.
 */

import {MessageTypes} from '~/Constants';
import {CallMessage} from '~/components/channel/CallMessage';
import {ChannelIconChangeMessage} from '~/components/channel/ChannelIconChangeMessage';
import {ChannelNameChangeMessage} from '~/components/channel/ChannelNameChangeMessage';
import {GuildJoinMessage} from '~/components/channel/GuildJoinMessage';
import {PinSystemMessage} from '~/components/channel/PinSystemMessage';
import {RecipientAddMessage} from '~/components/channel/RecipientAddMessage';
import {RecipientRemoveMessage} from '~/components/channel/RecipientRemoveMessage';
import {UnknownMessage} from '~/components/channel/UnknownMessage';
import {UserMessage} from '~/components/channel/UserMessage';
import type {ChannelRecord} from '~/records/ChannelRecord';
import type {MessageRecord} from '~/records/MessageRecord';
import UserStore from '~/stores/UserStore';

export const getMessageComponent = (
	_channel: ChannelRecord,
	message: MessageRecord,
	forceUnknownMessageType: boolean,
) => {
	const currentUser = UserStore.getCurrentUser();
	if (forceUnknownMessageType && currentUser && message.author.id === currentUser.id) {
		return <UnknownMessage />;
	}

	switch (message.type) {
		case MessageTypes.USER_JOIN:
			return <GuildJoinMessage message={message} />;
		case MessageTypes.CHANNEL_PINNED_MESSAGE:
			return <PinSystemMessage message={message} />;
		case MessageTypes.RECIPIENT_ADD:
			return <RecipientAddMessage message={message} />;
		case MessageTypes.RECIPIENT_REMOVE:
			return <RecipientRemoveMessage message={message} />;
		case MessageTypes.CALL:
			return <CallMessage message={message} />;
		case MessageTypes.CHANNEL_NAME_CHANGE:
			return <ChannelNameChangeMessage message={message} />;
		case MessageTypes.CHANNEL_ICON_CHANGE:
			return <ChannelIconChangeMessage message={message} />;
		case MessageTypes.DEFAULT:
		case MessageTypes.REPLY:
		case MessageTypes.CLIENT_SYSTEM:
			return <UserMessage />;
		default:
			return <UnknownMessage />;
	}
};
