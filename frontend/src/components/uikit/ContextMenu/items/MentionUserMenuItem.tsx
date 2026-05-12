/*
 * SPDX-License-Identifier: AGPL-3.0-or-later
 * Copyright (C) 2020-2026 Fluxer Contributors
 * Copyright (C) 2026 Floodilka Contributors
 * Modified by Floodilka Contributors starting March 2026. See LICENSE and NOTICE.
 */

import {useLingui} from '@lingui/react/macro';
import {AtIcon} from '@phosphor-icons/react';
import {observer} from 'mobx-react-lite';
import React from 'react';
import {ComponentDispatch} from '~/lib/ComponentDispatch';
import type {UserRecord} from '~/records/UserRecord';
import {MenuItem} from '../MenuItem';

interface MentionUserMenuItemProps {
	user: UserRecord;
	onClose: () => void;
}

export const MentionUserMenuItem: React.FC<MentionUserMenuItemProps> = observer(({user, onClose}) => {
	const {t} = useLingui();
	const handleMentionUser = React.useCallback(() => {
		onClose();
		ComponentDispatch.dispatch('INSERT_MENTION', {userId: user.id});
	}, [user.id, onClose]);

	return (
		<MenuItem icon={<AtIcon size={16} />} onClick={handleMentionUser}>
			{t`Mention`}
		</MenuItem>
	);
});
