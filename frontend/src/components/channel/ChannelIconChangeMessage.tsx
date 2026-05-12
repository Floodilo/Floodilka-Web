/*
 * SPDX-License-Identifier: AGPL-3.0-or-later
 * Copyright (C) 2020-2026 Fluxer Contributors
 * Copyright (C) 2026 Floodilka Contributors
 * Modified by Floodilka Contributors starting March 2026. See LICENSE and NOTICE.
 */

import {Trans} from '@lingui/react/macro';
import {ImageSquareIcon} from '@phosphor-icons/react';
import {observer} from 'mobx-react-lite';
import {SystemMessage} from '~/components/channel/SystemMessage';
import {SystemMessageUsername} from '~/components/channel/SystemMessageUsername';
import {useSystemMessageData} from '~/hooks/useSystemMessageData';
import type {MessageRecord} from '~/records/MessageRecord';

export const ChannelIconChangeMessage = observer(({message}: {message: MessageRecord}) => {
	const {author, channel, guild} = useSystemMessageData(message);

	if (!channel) {
		return null;
	}

	const messageContent = (
		<Trans>
			<SystemMessageUsername key={author.id} author={author} guild={guild} message={message} /> changed the channel
			icon.
		</Trans>
	);

	return <SystemMessage icon={ImageSquareIcon} iconWeight="bold" message={message} messageContent={messageContent} />;
});
