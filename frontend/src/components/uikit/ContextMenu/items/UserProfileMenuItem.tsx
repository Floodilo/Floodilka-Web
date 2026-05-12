/*
 * SPDX-License-Identifier: AGPL-3.0-or-later
 * Copyright (C) 2020-2026 Fluxer Contributors
 * Copyright (C) 2026 Floodilka Contributors
 * Modified by Floodilka Contributors starting March 2026. See LICENSE and NOTICE.
 */

import {useLingui} from '@lingui/react/macro';
import {UserIcon} from '@phosphor-icons/react';
import {observer} from 'mobx-react-lite';
import React from 'react';
import * as UserProfileActionCreators from '~/actions/UserProfileActionCreators';
import type {UserRecord} from '~/records/UserRecord';
import {MenuItem} from '../MenuItem';

interface UserProfileMenuItemProps {
	user: UserRecord;
	guildId?: string;
	onClose: () => void;
}

export const UserProfileMenuItem: React.FC<UserProfileMenuItemProps> = observer(({user, guildId, onClose}) => {
	const {t} = useLingui();
	const handleViewProfile = React.useCallback(() => {
		onClose();
		UserProfileActionCreators.openUserProfile(user.id, guildId);
	}, [onClose, user.id, guildId]);

	return (
		<MenuItem icon={<UserIcon size={16} />} onClick={handleViewProfile}>
			{t`View Profile`}
		</MenuItem>
	);
});
