/*
 * SPDX-License-Identifier: AGPL-3.0-or-later
 * Copyright (C) 2020-2026 Fluxer Contributors
 * Copyright (C) 2026 Floodilka Contributors
 * Modified by Floodilka Contributors starting March 2026. See LICENSE and NOTICE.
 */

import {useLingui} from '@lingui/react/macro';
import {observer} from 'mobx-react-lite';
import React from 'react';
import * as UserProfileActionCreators from '~/actions/UserProfileActionCreators';
import type {UserRecord} from '~/records/UserRecord';
import {AddNoteIcon} from '../ContextMenuIcons';
import {MenuItem} from '../MenuItem';

interface AddNoteMenuItemProps {
	user: UserRecord;
	onClose: () => void;
}

export const AddNoteMenuItem: React.FC<AddNoteMenuItemProps> = observer(({user, onClose}) => {
	const {t} = useLingui();
	const handleAddNote = React.useCallback(() => {
		UserProfileActionCreators.openUserProfile(user.id, undefined, true);
		onClose();
	}, [onClose, user.id]);

	return (
		<MenuItem icon={<AddNoteIcon />} onClick={handleAddNote}>
			{t`Add Note`}
		</MenuItem>
	);
});
