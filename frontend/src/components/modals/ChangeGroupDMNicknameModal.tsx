/*
 * SPDX-License-Identifier: AGPL-3.0-or-later
 * Copyright (C) 2020-2026 Fluxer Contributors
 * Copyright (C) 2026 Floodilka Contributors
 * Modified by Floodilka Contributors starting March 2026. See LICENSE and NOTICE.
 */

import {observer} from 'mobx-react-lite';
import React from 'react';
import * as ChannelActionCreators from '~/actions/ChannelActionCreators';
import {BaseChangeNicknameModal} from '~/components/modals/BaseChangeNicknameModal';
import type {UserRecord} from '~/records/UserRecord';
import ChannelStore from '~/stores/ChannelStore';

interface ChangeGroupDMNicknameModalProps {
	channelId: string;
	user: UserRecord;
}

export const ChangeGroupDMNicknameModal: React.FC<ChangeGroupDMNicknameModalProps> = observer(({channelId, user}) => {
	const channel = ChannelStore.getChannel(channelId);
	const currentNick = channel?.nicks?.[user.id] || '';

	const handleSave = React.useCallback(
		async (nick: string | null) => {
			await ChannelActionCreators.updateGroupDMNickname(channelId, user.id, nick);
		},
		[channelId, user.id],
	);

	return <BaseChangeNicknameModal currentNick={currentNick} displayName={user.displayName} onSave={handleSave} />;
});
