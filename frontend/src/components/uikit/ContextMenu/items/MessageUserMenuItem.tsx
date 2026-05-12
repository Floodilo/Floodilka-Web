/*
 * SPDX-License-Identifier: AGPL-3.0-or-later
 * Copyright (C) 2020-2026 Fluxer Contributors
 * Copyright (C) 2026 Floodilka Contributors
 * Modified by Floodilka Contributors starting March 2026. See LICENSE and NOTICE.
 */

import {useLingui} from '@lingui/react/macro';
import {ChatCircleIcon} from '@phosphor-icons/react';
import {observer} from 'mobx-react-lite';
import React from 'react';
import * as PrivateChannelActionCreators from '~/actions/PrivateChannelActionCreators';
import type {UserRecord} from '~/records/UserRecord';
import {MenuItem} from '../MenuItem';

interface MessageUserMenuItemProps {
	user: UserRecord;
	onClose: () => void;
}

export const MessageUserMenuItem: React.FC<MessageUserMenuItemProps> = observer(({user, onClose}) => {
	const {t} = useLingui();
	const handleMessageUser = React.useCallback(async () => {
		onClose();

		try {
			await PrivateChannelActionCreators.openDMChannel(user.id);
		} catch (error) {
			console.error('Failed to open DM channel:', error);
		}
	}, [user.id, onClose]);

	return (
		<MenuItem icon={<ChatCircleIcon size={16} />} onClick={handleMessageUser}>
			{t`Message`}
		</MenuItem>
	);
});
